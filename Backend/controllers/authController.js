const userModel = require("../models/userModel");

async function register(req, res) {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    const userId = await userModel.createUser(name, email, password, phone);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      userId: userId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Gagal mendaftar" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const isPasswordValid = await userModel.validatePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    // Fix: Add user role to the session
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role, // <-- Added role
    };

    res.json({
      success: true,
      message: "Login berhasil",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Gagal login" });
  }
}

// New function for dedicated admin login
async function adminLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const isPasswordValid = await userModel.validatePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    // Crucial check: ensure the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Akses ditolak. Akun ini bukan admin." });
    }

    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.json({
      success: true,
      message: "Admin login berhasil",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Gagal login sebagai admin" });
  }
}


function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Gagal logout" });
    }
    res.json({ success: true, message: "Logout berhasil" });
  });
}

function getAuthStatus(req, res) {
  if (req.session.user) {
    res.json({
      isAuthenticated: true,
      user: req.session.user,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
}

module.exports = {
  register,
  login,
  adminLogin, // <-- Export new function
  logout,
  getAuthStatus,
};
