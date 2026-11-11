require("dotenv").config()
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const employeeRouter = require("./routes/employee.routes");
const authRouter = require("./routes/auth.routes");
const AttendanceRouter = require("./routes/attendance.routes");
const leaveRouter = require("./routes/leave.routes");
const payslipRouter = require("./routes/payslip.routes");
const dashboardRouter = require("./routes/dashboard.routes");
const profileRouter = require("./routes/profile.routes");
const { serve } = require("inngest/express");
const { inngest, funs } = require("./inngest");

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use("/api/employee", employeeRouter);
app.use("/api/auth", authRouter)
app.use("/api/attendance", AttendanceRouter)
app.use("/api/leave",leaveRouter);
app.use("/api/payslip", payslipRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);

app.use("/api/inngest", serve({ client: inngest, funs }));


app.get("/",(req, res)=>{
    res.send("Server is running.")
});


module.exports = app;