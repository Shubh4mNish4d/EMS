const express = require("express");
const { getPayslips, getPayslipById, createPayslip } = require("../controllers/payslip.controller");
const { protect, AdminProtected } = require("../middlewares/auth.middleware");
const payslipRouter = express.Router();

payslipRouter.get("/", protect, getPayslips);
payslipRouter.get("/:id", protect, getPayslipById);
payslipRouter.post("/", protect, AdminProtected, createPayslip);

module.exports = payslipRouter;
