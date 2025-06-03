require("dotenv").config();
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");

// Create Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Connect to Redis (important!)
client.connect().catch(console.error);

// Handle connection events
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

client.on("connect", () => {
  console.log("✅ Connected to Redis");
});

const sessionConfig = session({
  store: new RedisStore({ client: client }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // auto detect
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
  },
});

module.exports = sessionConfig;
