const express = require("express"); 
const { protect } = require("../middlewares/auth.middleware");
const { getDashboardData } = require("../controllers/dashboard.controller");
const dashboardRouter =  express.Router();

dashboardRouter.get("/", protect, getDashboardData);

module.exports = dashboardRouter;