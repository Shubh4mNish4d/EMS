const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');
const EmployeeModel = require("../models/Employe.model");

async function createEmployee(req, res){
    try{
         const {firstName,lastName,email,phone,position,basicSalary,allowances,deductions,joinDate,employeeStatus,bio,department,password,role} = req.body;

        if(!firstName || !lastName || !email || !phone || !password){
            return res.status(400).json({
                message : "Missing rquired fileds"
            })
        };

         const isExist = await UserModel.findOne({email});
         if(isExist){
            return res.status(400).json({error : "Email already exist!"})
         }

        const hashesPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            email,
            password : hashesPassword,
            role : role || "EMPLOYEE"
        });

        const employee = await EmployeeModel.create({
            userId : user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            basicSalary :Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            employeeStatus :employeeStatus ||  "ACTIVE" ,
            joinDate : new Date(joinDate),
            bio : bio || "",
            department,
        });

        return res.status(200).json({success :true, message:"Employee created!", employee});

    }catch(err){
        if(err.code === 11000) return res.status(400).json({error: "Email already exists"});

        console.error("Create employee error",err);

        return res.status(500).json({error: "Failed to create employee"});
    }  
}

async function getEmployees(req, res){
    try{ 
       const {department} = req.query;

       if(department) {
            const where = {};
            where.department = department;
            const employees = await EmployeeModel.find(where).sort({createdAt: -1}).populate("userId", "email role").lean();

            const result = employees.map((emp)=>({
                    ...emp,
                    id: emp._id.toString(),
                    user : emp.userId ? {email : emp.userId.email, role : emp.userId.role} :null
                }));

            return res.status(200).json({result, message : "Fetch successfully"});

       };


        const employees = await EmployeeModel.find().sort({createdAt :-1}).populate("userId").lean();

        const result = employees.map((emp)=>({
                ...emp,
                id: emp._id.toString(),
                user : emp.userId ? {email : emp.userId.email, role : emp.userId.role} :null
            }));

        return res.status(200).json({result, message : "Fetch successfully"});


    }catch(err){
        console.log("GetEmployee Error" , err.message)
        return res.status(500).json({error :"Failed to fetch"});
    }
};

async function updateEmployee(req, res){
    try{
        const {userId} =  req.params.id;
        const {firstName,lastName,email,phone,position,basicSalary,allowances,deductions,employeeStatus,joinDate,bio,department,password,role} = req.body;

        const employee = await EmployeeModel.findOne(userId);

        if(!employee) return res.status(404).json({error:"Empoyee not found"});

        const updatedEmployee =await EmployeeModel.findOneAndUpdate(userId , {
                firstName,
                lastName,
                email,
                phone,
                position,
                basicSalary :Number(basicSalary) || 0,
                allowances: Number(allowances) || 0,
                deductions: Number(deductions) || 0,
                employeeStatus : employeeStatus || "ACTIVE" ,
                joinDate : new Date(joinDate),
                bio : bio || "",
                department,
        });

        const updatedUserData = {email};
        if(email){updatedUserData.role = role};
        if(password){
            const hashedPassword =await bcrypt.hash(password, 10) 
            updatedUserData.password = hashedPassword;
        };

        const updatedUser =await UserModel.findByIdAndUpdate(updatedEmployee.userId ,{updatedUserData});

        return res.status(201).json({message:"Updated successfully"});

    }catch(err){
        if(err.code === 11000) return res.status(400).json({error: "Email already exists"});

        console.error("Update employee error",err.message);
        res.status(500).json({error : "Failed to update employee" })
    }
}

async function deleteEmployee(req, res){
   try{
        const {id} = req.params;

        const Employee = await EmployeeModel.findById(id);

        if(!Employee) return res.status(404).json({error: "Empoyee not found"});

        const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);

        const success = await UserModel.findByIdAndDelete(deletedEmployee.userId);

        if(success) return res.status(200).json({message : "Deleted Successfully", deletedEmployee});

   }catch(err){
        console.error("Update employee error",err.message);
        res.status(500).json({error : "Failed to delete employee" })
   }
};


module.exports ={createEmployee, getEmployees, deleteEmployee, updateEmployee}
