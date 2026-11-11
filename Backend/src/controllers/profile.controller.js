const EmployeeModel = require("../models/Employe.model");

async function getProfile(req, res) {
    try{
        const session = req.session;
        
        if(session.role === "ADMIN"){

            return res.status(200).json({message : "Fetched Successfully", profile:{
                firstName: "ADMIN",
                lastName : "",
                email : session.email,
                role: session.role
            }})
        }
        else {
            const employee = await EmployeeModel.findOne({userId : session.userId});

            if(!employee) return res.status(404).json({error : "Employee not found"});

            return res.status(200).json({message : "Fetched Successfully", profile:{
                firstName: employee.firstName,
                lastName : employee.lastName,
                email : employee.email,
                role: employee.role,
                position : employee.position,
                bio: employee.bio
            }})
        }
    }
    catch(err){
        console.error("Get profile error", err.message);
        return res.status(500).json("Faild to get profile");
    }
}

async function updateProfile(req, res) {
    try{
        const session = req.session;

        const bio = req.body.bio;

        if(!bio) return res.status(400).json({error : "Bio missing."})

        const employee = await EmployeeModel.findOne({userId :session.userId});

        if(!employee) return res.status(404).json({error : "Employee not found"});
        if(employee.isDeleted) return res.status(403).json({error : "Your account is deactivated."});

        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(employee._id,{bio});

        return res.status(200).json({success:true, message : "Update Successfully", updatedEmployee});
    }
    catch(err){
        console.error("Update profile error", err.message);
        return res.status(500).json("Faild to update profile");
    }
};

module.exports = {getProfile, updateProfile};