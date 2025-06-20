const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// Konfigurasi koneksi ke MySQL dari .env
const dbOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Buat session store dari MySQL
const sessionStore = new MySQLStore(dbOptions);

// Middleware session
const sessionConfig = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 hari
    secure: true, // TRUE karena kamu pakai HTTPS (sudah kamu bilang)
    httpOnly: true,
    sameSite: "none", // Penting agar cookie dikirim ke frontend beda origin
  },
});

module.exports = sessionConfig;
