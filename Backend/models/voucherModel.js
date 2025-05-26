const { pool } = require("../config/database");

// Cek voucher valid dan belum digunakan user
async function validateVoucher(voucherCode, userId, email, orderTotal) {
  const connection = await pool.getConnection();
  try {
    // Cek voucher ada dan aktif
    const [vouchers] = await connection.query(
      `SELECT * FROM vouchers WHERE code = ? AND is_active = 1`,
      [voucherCode]
    );

    if (vouchers.length === 0) {
      return {
        valid: false,
        message: "Kode voucher tidak valid atau sudah tidak aktif",
      };
    }

    const voucher = vouchers[0];

    // Cek minimum order
    if (orderTotal < voucher.min_order) {
      return {
        valid: false,
        message: `Minimum order Rp ${voucher.min_order.toLocaleString(
          "id-ID"
        )} untuk menggunakan voucher ini`,
      };
    }

    // Cek apakah user sudah menggunakan voucher ini
    const [usageCheck] = await connection.query(
      `SELECT id FROM user_voucher_usage 
       WHERE voucher_id = ? AND (user_id = ? OR email = ?)`,
      [voucher.id, userId, email]
    );

    if (usageCheck.length > 0) {
      return {
        valid: false,
        message: "Anda sudah menggunakan voucher ini sebelumnya",
      };
    }

    // Hitung diskon
    let discountAmount = 0;
    if (voucher.discount_type === "percentage") {
      discountAmount = (orderTotal * voucher.discount_value) / 100;
      if (voucher.max_discount && discountAmount > voucher.max_discount) {
        discountAmount = voucher.max_discount;
      }
    } else {
      discountAmount = voucher.discount_value;
    }

    return {
      valid: true,
      voucher: voucher,
      discountAmount: discountAmount,
      message: "Voucher berhasil diterapkan",
    };
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Catat penggunaan voucher
async function recordVoucherUsage(voucherId, userId, email) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `INSERT INTO user_voucher_usage (voucher_id, user_id, email) VALUES (?, ?, ?)`,
      [voucherId, userId, email]
    );
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Ambil semua voucher aktif (untuk ditampilkan ke user)
async function getActiveVouchers() {
  try {
    const [vouchers] = await pool.query(
      `SELECT code, name, description, discount_type, discount_value, min_order, max_discount 
       FROM vouchers WHERE is_active = 1 ORDER BY name`
    );
    return vouchers;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  validateVoucher,
  recordVoucherUsage,
  getActiveVouchers,
};
