const express = require("express");
const orderController = require("../controllers/orderController");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

// Existing routes
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.get("/user/orders", isAuthenticated, orderController.getUserOrders);

// New webhook route for Midtrans notifications
router.post("/webhook", orderController.handleMidtransWebhook);

router.put(
  "/:orderNumber/payment-update",
  isAuthenticated,
  orderController.updatePaymentMethod
);
module.exports = router;
