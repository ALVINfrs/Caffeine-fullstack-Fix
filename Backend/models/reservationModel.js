const { pool } = require("../config/database");

// Get available rooms and tables
async function getAvailableRooms() {
  const [rooms] = await pool.query(`
    SELECT room_type, table_number, capacity, description, price_per_hour 
    FROM room_tables 
    WHERE is_available = 1 
    ORDER BY room_type, table_number
  `);

  // Group by room type
  const roomsByType = rooms.reduce((acc, room) => {
    if (!acc[room.room_type]) {
      acc[room.room_type] = [];
    }
    acc[room.room_type].push(room);
    return acc;
  }, {});

  return roomsByType;
}

// Check table availability for specific date and time
async function checkTableAvailability(
  roomType,
  tableNumber,
  date,
  time,
  durationHours,
  excludeReservationId = null
) {
  let query = `
    SELECT COUNT(*) as conflict_count 
    FROM reservations 
    WHERE room_type = ? 
    AND table_number = ? 
    AND reservation_date = ? 
    AND status NOT IN ('cancelled', 'no-show')
    AND (
      (reservation_time <= ? AND DATE_ADD(CONCAT(reservation_date, ' ', reservation_time), INTERVAL duration_hours HOUR) > ?) 
      OR 
      (? <= reservation_time AND ? > reservation_time)
    )
  `;

  const params = [
    roomType,
    tableNumber,
    date,
    time,
    `${date} ${time}`,
    time,
    `${date} ${time}`,
  ];

  if (excludeReservationId) {
    query += ` AND id != ?`;
    params.push(excludeReservationId);
  }

  const [result] = await pool.query(query, params);
  return result[0].conflict_count === 0;
}

// Get table price
async function getTablePrice(roomType, tableNumber) {
  const [result] = await pool.query(
    "SELECT price_per_hour FROM room_tables WHERE room_type = ? AND table_number = ?",
    [roomType, tableNumber]
  );

  return result.length > 0 ? result[0].price_per_hour : 0;
}

// Create new reservation
async function createReservation(reservationData) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const {
      userId,
      customerName,
      email,
      phone,
      reservationDate,
      reservationTime,
      durationHours,
      roomType,
      tableNumber,
      guestCount,
      specialRequest,
    } = reservationData;

    // Check availability
    const isAvailable = await checkTableAvailability(
      roomType,
      tableNumber,
      reservationDate,
      reservationTime,
      durationHours
    );

    if (!isAvailable) {
      throw new Error("Meja tidak tersedia untuk waktu yang dipilih");
    }

    // Get price per hour
    const pricePerHour = await getTablePrice(roomType, tableNumber);
    const totalPrice = pricePerHour * durationHours;

    // Create reservation
    const [result] = await connection.query(
      `
      INSERT INTO reservations 
      (user_id, customer_name, email, phone, reservation_date, reservation_time, 
       duration_hours, room_type, table_number, guest_count, special_request, 
       price_per_hour, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `,
      [
        userId,
        customerName,
        email,
        phone,
        reservationDate,
        reservationTime,
        durationHours,
        roomType,
        tableNumber,
        guestCount,
        specialRequest,
        pricePerHour,
        totalPrice,
      ]
    );

    const reservationId = result.insertId;

    // Generate reservation number
    const reservationNumber = `RES-${reservationId}-${Date.now()
      .toString()
      .slice(-6)}`;

    // Update with reservation number
    await connection.query(
      "UPDATE reservations SET reservation_number = ? WHERE id = ?",
      [reservationNumber, reservationId]
    );

    // Add to history
    await connection.query(
      `
      INSERT INTO reservation_history 
      (reservation_id, action, new_date, new_time, notes)
      VALUES (?, 'created', ?, ?, 'Reservasi dibuat')
    `,
      [reservationId, reservationDate, reservationTime]
    );

    await connection.commit();

    return {
      reservationId,
      reservationNumber,
      totalPrice,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get reservation by ID
async function getReservationById(reservationId) {
  const [reservations] = await pool.query(
    `
    SELECT r.*, rt.description as table_description, rt.capacity as table_capacity
    FROM reservations r
    LEFT JOIN room_tables rt ON r.room_type = rt.room_type AND r.table_number = rt.table_number
    WHERE r.id = ?
  `,
    [reservationId]
  );

  if (reservations.length === 0) {
    return null;
  }

  return reservations[0];
}

// Get reservation by reservation number
async function getReservationByNumber(reservationNumber) {
  const [reservations] = await pool.query(
    `
    SELECT r.*, rt.description as table_description, rt.capacity as table_capacity
    FROM reservations r
    LEFT JOIN room_tables rt ON r.room_type = rt.room_type AND r.table_number = rt.table_number
    WHERE r.reservation_number = ?
  `,
    [reservationNumber]
  );

  if (reservations.length === 0) {
    return null;
  }

  return reservations[0];
}

// Get user reservations
async function getUserReservations(userId) {
  const [reservations] = await pool.query(
    `
    SELECT r.*, rt.description as table_description, rt.capacity as table_capacity
    FROM reservations r
    LEFT JOIN room_tables rt ON r.room_type = rt.room_type AND r.table_number = rt.table_number
    WHERE r.user_id = ?
    ORDER BY r.reservation_date DESC, r.reservation_time DESC
  `,
    [userId]
  );

  return reservations;
}

// Reschedule reservation
async function rescheduleReservation(
  reservationId,
  newDate,
  newTime,
  durationHours
) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Get current reservation
    const [current] = await connection.query(
      "SELECT * FROM reservations WHERE id = ?",
      [reservationId]
    );

    if (current.length === 0) {
      throw new Error("Reservasi tidak ditemukan");
    }

    const reservation = current[0];

    // Check if can be rescheduled (only pending or confirmed)
    if (!["pending", "confirmed"].includes(reservation.status)) {
      throw new Error("Reservasi tidak dapat dijadwal ulang");
    }

    // Check new slot availability
    const isAvailable = await checkTableAvailability(
      reservation.room_type,
      reservation.table_number,
      newDate,
      newTime,
      durationHours,
      reservationId
    );

    if (!isAvailable) {
      throw new Error("Waktu baru tidak tersedia");
    }

    // Recalculate price if duration changed
    const pricePerHour = await getTablePrice(
      reservation.room_type,
      reservation.table_number
    );
    const newTotalPrice = pricePerHour * durationHours;

    const oldDate = reservation.reservation_date;
    const oldTime = reservation.reservation_time;

    // Update reservation
    await connection.query(
      `
      UPDATE reservations 
      SET reservation_date = ?, reservation_time = ?, duration_hours = ?, 
          total_price = ?, updated_at = NOW()
      WHERE id = ?
    `,
      [newDate, newTime, durationHours, newTotalPrice, reservationId]
    );

    // Add to history
    await connection.query(
      `
      INSERT INTO reservation_history 
      (reservation_id, action, old_date, old_time, new_date, new_time, notes)
      VALUES (?, 'rescheduled', ?, ?, ?, ?, 'Reservasi dijadwal ulang')
    `,
      [reservationId, oldDate, oldTime, newDate, newTime]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Cancel reservation
async function cancelReservation(reservationId, reason = null) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Get current reservation
    const [current] = await connection.query(
      "SELECT * FROM reservations WHERE id = ?",
      [reservationId]
    );

    if (current.length === 0) {
      throw new Error("Reservasi tidak ditemukan");
    }

    const reservation = current[0];

    // Check if can be cancelled
    if (["completed", "cancelled"].includes(reservation.status)) {
      throw new Error("Reservasi tidak dapat dibatalkan");
    }

    // Update status
    await connection.query(
      `
      UPDATE reservations 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = ?
    `,
      [reservationId]
    );

    // Add to history
    await connection.query(
      `
      INSERT INTO reservation_history 
      (reservation_id, action, notes)
      VALUES (?, 'cancelled', ?)
    `,
      [reservationId, reason || "Reservasi dibatalkan oleh user"]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Update reservation status
async function updateReservationStatus(reservationId, status) {
  await pool.query(
    `
    UPDATE reservations 
    SET status = ?, updated_at = NOW()
    WHERE id = ?
  `,
    [status, reservationId]
  );

  // Add to history
  await pool.query(
    `
    INSERT INTO reservation_history 
    (reservation_id, action, notes)
    VALUES (?, ?, ?)
  `,
    [reservationId, status, `Status diubah menjadi ${status}`]
  );
}

// Get reservation history
async function getReservationHistory(reservationId) {
  const [history] = await pool.query(
    `
    SELECT * FROM reservation_history 
    WHERE reservation_id = ?
    ORDER BY created_at DESC
  `,
    [reservationId]
  );

  return history;
}

module.exports = {
  getAvailableRooms,
  checkTableAvailability,
  getTablePrice,
  createReservation,
  getReservationById,
  getReservationByNumber,
  getUserReservations,
  rescheduleReservation,
  cancelReservation,
  updateReservationStatus,
  getReservationHistory,
};
