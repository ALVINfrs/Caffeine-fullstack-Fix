require("dotenv").config();
const session = require("express-session");
const RedisStore = require("connect-redis").default; // ✅ fix di v6
const redis = require("redis");

// Buat Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.connect().catch(console.error);

// Event listener
client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

client.on("connect", () => {
  console.log("✅ Connected to Redis");
});

// Konfigurasi session
const sessionConfig = session({
  store: new RedisStore({
    client: client,
    prefix: "caffeine_session:",
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
  },
});

module.exports = sessionConfig;
