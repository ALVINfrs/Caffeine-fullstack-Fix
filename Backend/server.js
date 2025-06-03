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
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3001", // untuk development
      "https://caffeine-fullstack-fix.vercel.app", // atau domain frontend yang sudah deploy
      "https://caffeine-fullstack-fix-production.up.railway.app", // jika frontend juga di railway
    ],
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
