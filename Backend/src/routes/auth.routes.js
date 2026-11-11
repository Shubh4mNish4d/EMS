const express = require("express");
const { login, session, updatePassword } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
;
const authRouter = express.Router();



authRouter.get("/session", protect, session)
authRouter.post("/login", login)
authRouter.patch("/change-password", protect, updatePassword)


module.exports = authRouter;