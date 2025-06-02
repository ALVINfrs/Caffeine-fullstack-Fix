require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { testConnection } = require("./config/database");
const sessionConfig = require("./config/session");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // izinkan semua origin
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionConfig);

testConnection();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/reservations", reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
