const express = require("express");
const { ClockInOut, getAttendance } = require("../controllers/attendance.controller");
const { protect } = require("../middlewares/auth.middleware");
const AttendanceRouter = express.Router();

AttendanceRouter.post("/", protect, ClockInOut);
AttendanceRouter.get("/", protect, getAttendance)

module.exports = AttendanceRouter;