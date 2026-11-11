const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile.controller");
const { protect } = require("../middlewares/auth.middleware");
const profileRouter = express.Router();

profileRouter.get("/", protect, getProfile)
profileRouter.patch("/", protect, updateProfile);

module.exports = profileRouter;