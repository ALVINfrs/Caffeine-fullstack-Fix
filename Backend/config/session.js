const session = require("express-session");

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "defaultsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 hari
    secure: true, // cookie hanya dikirim lewat HTTPS
    httpOnly: true, // mencegah akses cookie dari JavaScript di browser
    sameSite: "none", // izinkan cookie dikirim dari cross-site (wajib pakai HTTPS)
  },
});

module.exports = sessionConfig;
