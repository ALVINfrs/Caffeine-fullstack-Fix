const voucherModel = require("../models/voucherModel");

// Validasi voucher saat user input kode
async function validateVoucher(req, res) {
  try {
    const { voucherCode, total } = req.body;
    const userId = req.session?.userId || null;
    const email = req.body.email || req.session?.email;

    if (!voucherCode || !total || !email) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap",
      });
    }

    const result = await voucherModel.validateVoucher(
      voucherCode.toUpperCase(),
      userId,
      email,
      parseFloat(total)
    );

    if (result.valid) {
      res.json({
        success: true,
        message: result.message,
        voucher: {
          id: result.voucher.id,
          code: result.voucher.code,
          name: result.voucher.name,
          discountAmount: result.discountAmount,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error validating voucher:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memvalidasi voucher",
    });
  }
}

// Ambil daftar voucher aktif
async function getActiveVouchers(req, res) {
  try {
    const vouchers = await voucherModel.getActiveVouchers();
    res.json({
      success: true,
      vouchers: vouchers,
    });
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data voucher",
    });
  }
}

module.exports = {
  validateVoucher,
  getActiveVouchers,
};
