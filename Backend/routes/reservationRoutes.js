const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// Public routes
router.get("/rooms", reservationController.getAvailableRooms);
router.get("/check-availability", reservationController.checkAvailability);
router.post("/create", reservationController.createReservation);
router.get("/:reservationNumber", reservationController.getReservationByNumber);

// Protected routes (require login)
router.get("/user/my-reservations", reservationController.getUserReservations);
router.put(
  "/:reservationId/reschedule",
  reservationController.rescheduleReservation
);
router.put("/:reservationId/cancel", reservationController.cancelReservation);
router.get(
  "/:reservationId/history",
  reservationController.getReservationHistory
);

module.exports = router;
