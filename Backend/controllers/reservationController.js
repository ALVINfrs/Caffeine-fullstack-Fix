const reservationModel = require("../models/reservationModel");

// Get available rooms
async function getAvailableRooms(req, res) {
  try {
    const rooms = await reservationModel.getAvailableRooms();

    // Format room names for better UX
    const roomNames = {
      "coding-zone": "Coding Zone",
      "meeting-room": "Meeting Room",
      "quiet-corner": "Quiet Corner",
      "open-space": "Open Space",
    };

    const formattedRooms = Object.keys(rooms).map((roomType) => {
      const tables = rooms[roomType];
      // Calculate average price for the room
      const totalPrice = tables.reduce(
        (sum, table) => sum + table.price_per_hour,
        0
      );
      const pricePerHour = tables.length > 0 ? totalPrice / tables.length : 0;

      return {
        type: roomType,
        name: roomNames[roomType],
        description: getRoomDescription(roomType),
        pricePerHour: pricePerHour, // Add pricePerHour to room
        tables: tables.map((table) => ({
          ...table,
          formatted_price: formatPrice(table.price_per_hour),
        })),
      };
    });

    res.json({
      success: true,
      data: formattedRooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      error: "Gagal mengambil data ruangan",
    });
  }
}

// Check table availability
async function checkAvailability(req, res) {
  const { roomType, tableNumber, date, time, duration } = req.query;

  if (!roomType || !tableNumber || !date || !time) {
    return res.status(400).json({
      success: false,
      error: "Parameter tidak lengkap",
    });
  }

  try {
    const isAvailable = await reservationModel.checkTableAvailability(
      roomType,
      tableNumber,
      date,
      time,
      parseInt(duration) || 2
    );

    // Get price for calculation
    const pricePerHour = await reservationModel.getTablePrice(
      roomType,
      tableNumber
    );
    const totalPrice = pricePerHour * (parseInt(duration) || 2);

    res.json({
      success: true,
      available: isAvailable,
      pricePerHour: pricePerHour,
      totalPrice: totalPrice,
      formattedPrice: formatPrice(totalPrice),
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      error: "Gagal memeriksa ketersediaan",
    });
  }
}

// Create reservation
async function createReservation(req, res) {
  const {
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
  } = req.body;

  // Validation
  if (
    !customerName ||
    !email ||
    !phone ||
    !reservationDate ||
    !reservationTime ||
    !roomType ||
    !tableNumber
  ) {
    return res.status(400).json({
      success: false,
      error: "Data tidak lengkap",
    });
  }

  // Check if reservation date is not in the past
  const now = new Date();
  const reservationDateTime = new Date(`${reservationDate} ${reservationTime}`);

  if (reservationDateTime < now) {
    return res.status(400).json({
      success: false,
      error: "Tidak dapat membuat reservasi untuk waktu yang sudah berlalu",
    });
  }

  try {
    const userId = req.session?.userId || null;

    const reservationData = {
      userId,
      customerName,
      email,
      phone,
      reservationDate,
      reservationTime,
      durationHours: parseInt(durationHours) || 2,
      roomType,
      tableNumber,
      guestCount: parseInt(guestCount) || 1,
      specialRequest,
    };

    const result = await reservationModel.createReservation(reservationData);

    res.status(201).json({
      success: true,
      message: "Reservasi berhasil dibuat",
      data: {
        reservationId: result.reservationId,
        reservationNumber: result.reservationNumber,
        totalPrice: result.totalPrice,
        formattedPrice: formatPrice(result.totalPrice),
      },
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Gagal membuat reservasi",
    });
  }
}

// Get reservation by number
async function getReservationByNumber(req, res) {
  const { reservationNumber } = req.params;

  try {
    const reservation = await reservationModel.getReservationByNumber(
      reservationNumber
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: "Reservasi tidak ditemukan",
      });
    }

    // Format response
    const formattedReservation = formatReservationResponse(reservation);

    res.json({
      success: true,
      data: formattedReservation,
    });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({
      success: false,
      error: "Gagal mengambil data reservasi",
    });
  }
}

// Get user reservations
async function getUserReservations(req, res) {
  if (!req.session?.userId) {
    return res.status(401).json({
      success: false,
      error: "Silakan login terlebih dahulu",
    });
  }

  try {
    const reservations = await reservationModel.getUserReservations(
      req.session.userId
    );

    const formattedReservations = reservations.map((reservation) =>
      formatReservationResponse(reservation)
    );

    res.json({
      success: true,
      data: formattedReservations,
    });
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({
      success: false,
      error: "Gagal mengambil data reservasi",
    });
  }
}

// Reschedule reservation
async function rescheduleReservation(req, res) {
  const { reservationId } = req.params;
  const { newDate, newTime, durationHours } = req.body;

  if (!newDate || !newTime) {
    return res.status(400).json({
      success: false,
      error: "Tanggal dan waktu baru harus diisi",
    });
  }

  // Check if new date is not in the past
  const now = new Date();
  const newDateTime = new Date(`${newDate} ${newTime}`);

  if (newDateTime < now) {
    return res.status(400).json({
      success: false,
      error: "Tidak dapat menjadwal ulang untuk waktu yang sudah berlalu",
    });
  }

  try {
    await reservationModel.rescheduleReservation(
      parseInt(reservationId),
      newDate,
      newTime,
      parseInt(durationHours) || 2
    );

    res.json({
      success: true,
      message: "Reservasi berhasil dijadwal ulang",
    });
  } catch (error) {
    console.error("Error rescheduling reservation:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Gagal menjadwal ulang reservasi",
    });
  }
}

// Cancel reservation
async function cancelReservation(req, res) {
  const { reservationId } = req.params;
  const { reason } = req.body;

  try {
    await reservationModel.cancelReservation(parseInt(reservationId), reason);

    res.json({
      success: true,
      message: "Reservasi berhasil dibatalkan",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Gagal membatalkan reservasi",
    });
  }
}

// Get reservation history
async function getReservationHistory(req, res) {
  const { reservationId } = req.params;

  try {
    const history = await reservationModel.getReservationHistory(
      parseInt(reservationId)
    );

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching reservation history:", error);
    res.status(500).json({
      success: false,
      error: "Gagal mengambil riwayat reservasi",
    });
  }
}

// Helper functions
function getRoomDescription(roomType) {
  const descriptions = {
    "coding-zone": "Area khusus untuk coding dengan setup programming terbaik",
    "meeting-room":
      "Ruang meeting untuk diskusi tim dengan fasilitas presentasi",
    "quiet-corner": "Area tenang untuk fokus maksimal dan deep work",
    "open-space": "Area terbuka untuk networking dan collaborative work",
  };

  return descriptions[roomType] || "";
}

function formatReservationResponse(reservation) {
  const statusNames = {
    pending: "Menunggu Konfirmasi",
    confirmed: "Dikonfirmasi",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    "no-show": "Tidak Hadir",
  };

  const roomNames = {
    "coding-zone": "Coding Zone",
    "meeting-room": "Meeting Room",
    "quiet-corner": "Quiet Corner",
    "open-space": "Open Space",
  };

  return {
    ...reservation,
    status_name: statusNames[reservation.status],
    room_name: roomNames[reservation.room_type],
    formatted_date: new Date(reservation.reservation_date).toLocaleDateString(
      "id-ID"
    ),
    formatted_time: reservation.reservation_time.substring(0, 5),
    end_time: calculateEndTime(
      reservation.reservation_time,
      reservation.duration_hours
    ),
    formatted_price: formatPrice(reservation.total_price || 0),
  };
}

function calculateEndTime(startTime, durationHours) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endHours = hours + durationHours;
  const endTime = `${endHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return endTime;
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

module.exports = {
  getAvailableRooms,
  checkAvailability,
  createReservation,
  getReservationByNumber,
  getUserReservations,
  rescheduleReservation,
  cancelReservation,
  getReservationHistory,
};
