const express = require("express");
const { protect, AdminProtected } = require("../middlewares/auth.middleware");
const { getLeaves, updateLeave, createLeave } = require("../controllers/leave.controller");
const leaveRouter =  express.Router();


leaveRouter.get("/",protect, getLeaves)
leaveRouter.post("/", protect, createLeave)
leaveRouter.patch("/:id", protect, AdminProtected, updateLeave)

module.exports = leaveRouter;
