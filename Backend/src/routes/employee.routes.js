const express = require("express");
const { createEmployee, getEmployees, deleteEmployee, updateEmployee } = require("../controllers/employee.controller");
const { AdminProtected, protect } = require("../middlewares/auth.middleware");
const employeeRouter = express.Router();


employeeRouter.get("/", protect, AdminProtected, getEmployees);
employeeRouter.post("/", protect, AdminProtected, createEmployee);
employeeRouter.delete("/:id", protect, AdminProtected, deleteEmployee);
employeeRouter.patch("/:id", protect, AdminProtected, updateEmployee);

module.exports = employeeRouter;
