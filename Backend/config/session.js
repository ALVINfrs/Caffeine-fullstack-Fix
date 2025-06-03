const session = require("express-session");
const FileStore = require("session-file-store")(session);

const sessionConfig = session({
  store: new FileStore({
    path: "./sessions",
    retries: 0,
  }),
  secret: process.env.SESSION_SECRET || "defaultsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 hari
    secure: true, // WAJIB true kalau sudah pakai HTTPS
    httpOnly: true,
    sameSite: "none", // WAJIB "none" kalau frontend beda domain dan pakai HTTPS
  },
});

module.exports = sessionConfig;
