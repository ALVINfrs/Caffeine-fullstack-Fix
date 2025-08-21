const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { 
  getStats,
  getSalesChartData,
  getUsers,
  getProducts,
  getOrders,
  getReservations,
  getVouchers 
} = require('../controllers/adminController');

// All routes in this file are protected by the adminAuth middleware
router.use(adminAuth);

router.get('/stats', getStats);
router.get('/sales-chart', getSalesChartData);
router.get('/users', getUsers);
router.get('/products', getProducts);
router.get('/orders', getOrders);
router.get('/reservations', getReservations);
router.get('/vouchers', getVouchers);

module.exports = router;
