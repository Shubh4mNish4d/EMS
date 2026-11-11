const mongoose = require("mongoose");

const AttendnceSchema = new mongoose.Schema({
    employeeId : {type:mongoose.Schema.Types.ObjectId, ref:"Employee", required:true},
    date : {type:Date, required:true},
    checkIn : {type:Date, required:true, default:null},
    checkOut : {type:Date, default:null},
    status: {type:String, required:true, enum:["PRESENT","ABSENT","LATE",null], default:null },
    workingHours: {type:Number, default:null},
    dayType: {type:String, enum:["Full Day","Half Day",null], default:null}
},{timestamps:true});

const AttendanceModel = mongoose.model.AttendanceModel || mongoose.model("Attendance", AttendnceSchema);

module.exports = AttendanceModel;