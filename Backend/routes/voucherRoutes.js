const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");

// Route untuk validasi voucher
router.post("/validate", voucherController.validateVoucher);

// Route untuk ambil daftar voucher aktif
router.get("/active", voucherController.getActiveVouchers);

module.exports = router;
