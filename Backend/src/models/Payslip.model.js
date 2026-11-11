const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema({
    employeeId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"Employee"},
    month: {type:Number, required:true},
    year: {type:Number, required:true},
    basicSalary :{type:Number, required:true},
    allowances :{type:Number, required:true, default: 0},
    deductions :{type:Number, required:true , default: 0},
    netSalary :{type:Number, required:true}

},{timestamps: true});

const PayslipModel = mongoose.model.PayslipModel || mongoose.model("payslip", payslipSchema);


module.exports  = PayslipModel;
