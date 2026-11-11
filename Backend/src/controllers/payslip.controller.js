const EmployeeModel = require("../models/Employe.model");
const PayslipModel = require("../models/Payslip.model");
const { session } = require("./auth.controller");



async function createPayslip(req, res){
   try{
        const {employeeId, month, year, basicSalary, allowances, deductions} = req.body;

        if(!employeeId || !month || !year || !basicSalary) return res.status(400).json({error : "Missing input fields"});

        const employee = await EmployeeModel.findById(employeeId);

        if(!employee) return res.status(404).json({error : "Employee not found"});

        let netSalary = Number(basicSalary);

        if(allowances){
            netSalary += Number(allowances)
        }

        if(deductions){
            netSalary -= Number(deductions)
        }

        const payslip = await PayslipModel.create({
            employeeId: employee._id,
            month:Number(month),
            year: Number(year), 
            basicSalary: Number(basicSalary),
            allowances: Number(allowances || 0) ,
            deductions: Number(deductions || 0),
            netSalary,
        });

        res.status(201).json({success:true, message:"Payslip generated successfully", data:payslip});
   }
   catch(err){
        console.error("Create payslip error", err.message);
        return res.status(500).json("Faild to create payslip");
   }
};



async function getPayslips(req, res) {

   try{
        const session =  req.session;

        if(session.role === "ADMIN"){

            const payslips = await PayslipModel.find().sort({createdAt : -1}).populate("employeeId");

            if(!payslips) return res.status(404).json({error: "Payslips not found"});

            return res.status(200).json({success:true, message:"Fetch payslips successfully" , data:payslips})
        }
        else{

            const employee = await EmployeeModel.findOne({userId : session.userId})

            if(!employee) return res.status(404).json({error: "Employee not found"});

            const EmpPayslips = await PayslipModel.find({employeeId : employee._id}).sort({createdAt : -1}).populate("employeeId");

            if(!EmpPayslips) return res.status(404).json({error: "Payslips not found"});

            return res.status(200).json({success:true, message : "Fetch payslips successfully", data:EmpPayslips})

        }
   }
   catch{err}{
        console.error("Get payslips error", err.message);
        return res.status(500).json("Faild to fetch");
   }
};


async function getPayslipById(req, res) {

    try{
        const id = req.params.id;

        const Payslip = await PayslipModel.findById(id).populate("employeeId");

        if(!Payslip) return res.status(404).json({error: "Payslip not found"});

        return res.status(200).json({success:true, message:"Fetch payslip successfully", Payslip});
    }
    catch(err){
         console.error("Get payslip by id error", err.message);
        return res.status(500).json("Faild to fetch");
    }
    
};

module.exports = {getPayslips, getPayslipById, createPayslip}