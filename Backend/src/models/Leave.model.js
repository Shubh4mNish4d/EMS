const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    employeeId: {type:mongoose.Schema.Types.ObjectId, ref : "Employee" , required:true},
    type: {type:String, enum :["SICK", "ANNUAL", "CASUAL"], required:true},
    startDate: {type:Date, required:true},
    endDate: {type:Date, required:true},
    reason : {type:String, required : true},
    status: {type:String, enum:["APPROVED", "REJECTED", "PENDING"], required:true, default:"PENDING"}
},{timestamps:true});

const LeaveModel = mongoose.model.LeaveModel || mongoose.model("Leave", leaveSchema);

module.exports = LeaveModel;

