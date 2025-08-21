const { pool } = require("../config/database");

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    // Placeholder for stats logic
    const [orders] = await pool.query("SELECT COUNT(*) as orderCount, SUM(total) as totalRevenue FROM orders WHERE status = 'paid'");
    const [users] = await pool.query("SELECT COUNT(*) as userCount FROM users");

    res.json({
      totalRevenue: orders[0].totalRevenue || 0,
      orderCount: orders[0].orderCount || 0,
      userCount: users[0].userCount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
}

// GET /api/admin/sales-chart
async function getSalesChartData(req, res) {
  try {
    // Placeholder for sales chart logic
    const [sales] = await pool.query(`
      SELECT DATE(order_date) as date, SUM(total) as total
      FROM orders
      WHERE status = 'paid'
      GROUP BY DATE(order_date)
      ORDER BY DATE(order_date) ASC
      LIMIT 30;
    `);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales chart data", error: error.message });
  }
}

// GET /api/admin/users
async function getUsers(req, res) {
  try {
    const [users] = await pool.query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
}

// GET /api/admin/products
async function getProducts(req, res) {
  try {
    const [products] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}

// GET /api/admin/orders
async function getOrders(req, res) {
  try {
    const [orders] = await pool.query("SELECT * FROM orders ORDER BY order_date DESC");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
}

// GET /api/admin/reservations
async function getReservations(req, res) {
  try {
    const [reservations] = await pool.query("SELECT * FROM reservations ORDER BY reservation_date DESC");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
}

// GET /api/admin/vouchers
async function getVouchers(req, res) {
  try {
    const [vouchers] = await pool.query("SELECT * FROM vouchers ORDER BY created_at DESC");
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vouchers", error: error.message });
  }
}

module.exports = {
  getStats,
  getSalesChartData,
  getUsers,
  getProducts,
  getOrders,
  getReservations,
  getVouchers,
};
