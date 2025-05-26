const { pool } = require("../config/database");

async function getConnection() {
  return await pool.getConnection();
}

async function createInitialOrder(connection, orderData, items) {
  try {
    const {
      userId,
      customerName,
      email,
      phone,
      address,
      subtotal,
      shipping,
      total,
      paymentMethod,
      status,
      voucherId,
      voucherCode,
      voucherDiscount,
    } = orderData;

    // Create initial order dengan data voucher
    const [orderResult] = await connection.query(
      `INSERT INTO orders
      (user_id, customer_name, email, phone, address, subtotal,
      shipping_fee, total, payment_method, order_date, status,
      voucher_id, voucher_code, voucher_discount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
      [
        userId,
        customerName,
        email,
        phone,
        address,
        subtotal,
        shipping,
        total,
        paymentMethod,
        status,
        voucherId,
        voucherCode,
        voucherDiscount || 0,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items
        (order_id, product_id, product_name, price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.price * item.quantity,
        ]
      );
    }

    // Generate order number
    const orderNumber = `KKS-${orderId}-${Date.now().toString().slice(-6)}`;

    // Update order with order number
    await connection.query("UPDATE orders SET order_number = ? WHERE id = ?", [
      orderNumber,
      orderId,
    ]);

    return {
      orderId,
      orderNumber,
    };
  } catch (error) {
    throw error;
  }
}

async function updateOrderWithSnapInfo(
  connection,
  orderId,
  snapToken,
  redirectUrl
) {
  await connection.query(
    `UPDATE orders
    SET snap_token = ?, snap_redirect_url = ?
    WHERE id = ?`,
    [snapToken, redirectUrl, orderId]
  );
}

async function updateOrderStatus(
  orderNumber,
  status,
  transactionId,
  transactionTime,
  vaNumber = null,
  bank = null,
  fraudStatus = null,
  paymentType = null
) {
  const connection = await pool.getConnection();
  try {
    let query = `
      UPDATE orders
      SET status = ?,
          transaction_id = ?,
          transaction_time = ?,
          va_number = ?,
          bank = ?,
          fraud_status = ?`;

    if (paymentType) {
      query += `, payment_method = ?`;
    }

    query += ` WHERE order_number = ?`;

    const params = paymentType
      ? [
          status,
          transactionId,
          transactionTime,
          vaNumber,
          bank,
          fraudStatus,
          paymentType,
          orderNumber,
        ]
      : [
          status,
          transactionId,
          transactionTime,
          vaNumber,
          bank,
          fraudStatus,
          orderNumber,
        ];

    await connection.query(query, params);
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function getOrderById(orderId) {
  const [orders] = await pool.query(
    `SELECT o.*, 
            v.name as voucher_name,
            v.description as voucher_description,
            v.discount_type as voucher_discount_type,
            v.discount_value as voucher_discount_value
     FROM orders o
     LEFT JOIN vouchers v ON o.voucher_id = v.id
     WHERE o.id = ?`,
    [orderId]
  );

  if (orders.length === 0) {
    return null;
  }

  // Get order items
  const [items] = await pool.query(
    `SELECT * FROM order_items WHERE order_id = ?`,
    [orderId]
  );

  const order = orders[0];

  // Format voucher information jika ada
  let voucherInfo = null;
  if (order.voucher_id) {
    voucherInfo = {
      id: order.voucher_id,
      code: order.voucher_code,
      name: order.voucher_name,
      description: order.voucher_description,
      discountType: order.voucher_discount_type,
      discountValue: order.voucher_discount_value,
      discountAmount: order.voucher_discount,
    };
  }

  return {
    order: {
      ...order,
      voucher: voucherInfo,
    },
    items: items,
  };
}

// Tambahan function untuk get order by order number
async function getOrderByNumber(orderNumber) {
  const [orders] = await pool.query(
    `SELECT o.*, 
            v.name as voucher_name,
            v.description as voucher_description,
            v.discount_type as voucher_discount_type,
            v.discount_value as voucher_discount_value
     FROM orders o
     LEFT JOIN vouchers v ON o.voucher_id = v.id
     WHERE o.order_number = ?`,
    [orderNumber]
  );

  if (orders.length === 0) {
    return null;
  }

  // Get order items
  const [items] = await pool.query(
    `SELECT * FROM order_items WHERE order_id = ?`,
    [orders[0].id]
  );

  const order = orders[0];

  // Format voucher information jika ada
  let voucherInfo = null;
  if (order.voucher_id) {
    voucherInfo = {
      id: order.voucher_id,
      code: order.voucher_code,
      name: order.voucher_name,
      description: order.voucher_description,
      discountType: order.voucher_discount_type,
      discountValue: order.voucher_discount_value,
      discountAmount: order.voucher_discount,
    };
  }

  return {
    order: {
      ...order,
      voucher: voucherInfo,
    },
    items: items,
  };
}

async function getUserOrders(userId) {
  const [orders] = await pool.query(
    `SELECT o.*, 
            v.name as voucher_name,
            v.description as voucher_description,
            v.discount_type as voucher_discount_type,
            v.discount_value as voucher_discount_value,
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
     FROM orders o
     LEFT JOIN vouchers v ON o.voucher_id = v.id
     WHERE o.user_id = ?
     ORDER BY o.order_date DESC`,
    [userId]
  );

  // Get items for each order dan format voucher info
  for (const order of orders) {
    const [items] = await pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );
    order.items = items;

    // Format voucher information jika ada
    if (order.voucher_id) {
      order.voucher = {
        id: order.voucher_id,
        code: order.voucher_code,
        name: order.voucher_name,
        description: order.voucher_description,
        discountType: order.voucher_discount_type,
        discountValue: order.voucher_discount_value,
        discountAmount: order.voucher_discount,
      };
    } else {
      order.voucher = null;
    }
  }

  return orders;
}

module.exports = {
  getConnection,
  createInitialOrder,
  updateOrderWithSnapInfo,
  updateOrderStatus,
  getOrderById,
  getOrderByNumber, // Tambahan export
  getUserOrders,
};
