const mongoose = require("mongoose");
const AttendanceModel = require("../models/Attendance.model");
const EmployeeModel = require("../models/Employe.model");
const { inngest } = require("../inngest");


async function ClockInOut(req, res){
   try{
        const session = req.session;

        const Employee = await EmployeeModel.findOne({
          userId : session.userId
        })

        if(!Employee) return res.status(404).json({error: "Employee not found"})

        if(Employee.isDeleted) return res.status(401).json({error: "Your account is deleted you cannot clock-in/out"});

        const today = new Date();
        today.setHours(0,0,0,0)

        const existing = await AttendanceModel.findOne({
            employeeId : Employee._id,
            date : today
        });

        const now = new Date();

        if(!existing){

            const isLate = now.getHours() >= 10; 

            const attendance = await AttendanceModel.create({
                employeeId : Employee._id,
                date : today,
                checkIn : now,
                status: isLate ? "LATE" : "PRESENT",
            });

            await inngest.send({
                name:"employee/clock-out",
                data: {
                    employeeId : Employee._id,
                    attendanceId : attendance._id
                }
            })

            return res.status(200).json({success: true, type:"CHECK-IN", data:attendance})
        }
        else if(!existing.checkOut){
        
            const checkInTime = new Date(existing.checkIn).getTime();
            const diiMnts = now.getTime() - checkInTime;
            const diffHours = diiMnts / (1000*60*60);
            
            existing.checkOut = now;
            let dayType = null; 

            workingHours = parseFloat(diffHours.toFixed(2));

            if(workingHours >= 4 && workingHours < 8 ){
                dayType = "Half Day"
            }
            else if(workingHours >= 8 ){
                dayType = "Full Day"
            }

            existing.workingHours = workingHours;
            existing.dayType = dayType;
            await existing.save();

            return res.status(200).json({success:true, type:"CHECK-OUT", date: existing})
    
        }
   }catch(err){
        console.error("Check In/Out error", err.message);
        return res.status(500).json({error : "Operation failed"})
   }
 
};

async function getAttendance(req, res){
    try{
        const session = req.session;

        const Employee = await EmployeeModel.findOne({
        userId : session.userId
        })

        if(!Employee) return res.status(404).json({error: "Employee not found"})

        if(Employee.isDeleted) return res.status(401).json({error: "Your account is deleted you cannot clock-in/out"});

        const limit = req.query.limit || 30 ;

        const history = await AttendanceModel.find({
            employeeId : Employee._id
        }).sort({date : -1}).limit(limit);

        return res.status(200).json({success:true, data : history, employee : {isDeleted : Employee.isDeleted}})

    }
    catch(err){
        console.error("Attendance", err.message);
        return res.status(500).json({error : "Failed to fetch attendance"})
    }
};

module.exports = {ClockInOut, getAttendance};