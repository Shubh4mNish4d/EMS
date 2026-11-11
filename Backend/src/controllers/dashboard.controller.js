const DEPARTMENTS = require("../constants/departments");
const AttendanceModel = require("../models/Attendance.model");
const EmployeeModel = require("../models/Employe.model");
const LeaveModel = require("../models/Leave.model");
const PayslipModel = require("../models/Payslip.model");

async function getDashboardData(req, res){
    try{
        const session =  req.session;

        if(session.role === "ADMIN"){
            const [totalEmployees, todaysAttendance, pendingLeaves] = await Promise.all([
                EmployeeModel.countDocuments({isDeleted : {$ne : true}}),
                AttendanceModel.countDocuments({
                    date : 
                    { $gte : new Date(new Date().setHours(0,0,0,0)),
                    $lt :  new Date(new Date().setHours(24,0,0,0)),
                    }}),
                LeaveModel.countDocuments({status : "PENDING"})
            ]);

            const totalDepartments = DEPARTMENTS.length;

            return res.status(200).json({message: "Fetched successfully", data :{
                role:"ADMIN",
                totalEmployees:totalEmployees,
                todaysAttendance:todaysAttendance,
                pendingLeaves:pendingLeaves,
                totalDepartments:totalDepartments
            }})
        }
        else{
            const employee = await EmployeeModel.findOne({userId:session.userId});

            if(!employee) return res.status(404).json({error: "Employee not found"});

            const today = new Date()

            const [totalDaysPresent, totalPendingLeaves, latestPayslip] = await Promise.all([
                AttendanceModel.countDocuments({employeeId : employee._id, date :{
                    $gt : new Date(today.getFullYear(), today.getMonth(), 1),
                    $lt : new Date(today.getFullYear(), today.getMonth() + 1, 1)
                }}),
                LeaveModel.countDocuments({employeeId : employee._id, status: "PENDING"}),
                PayslipModel.findOne({employeeId : employee._id}).sort({createdAt: -1}).populate("employeeId").lean()
            ]);

            return res.status(200).json({success:true, message : "Fetched successfully", data:{
                role:"EMPLOYEE",
                employee,
                totalDaysPresent,
                totalPendingLeaves,
                latestPayslip: latestPayslip ? latestPayslip : null,
            }})
        }
    }
    catch(err){
        console.error("Dashboard error" , err.message);
        return res.status(500).json({error : "Failed to fetch Dashboard data."})
    }
}

module.exports = {getDashboardData};