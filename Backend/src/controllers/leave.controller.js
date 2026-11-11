const { inngest } = require("../inngest");
const EmployeeModel = require("../models/Employe.model");
const LeaveModel = require("../models/Leave.model");
const { sendEmail } = require("../services/email.service");

async function createLeave(req, res) {

    try{
        const session = req.session;

        const {type, startDate, endDate, reason} = req.body;

        console.log(type, startDate, endDate, reason)

        const employee = await EmployeeModel.findOne({
            userId : session.userId
        });

        if(!employee) return res.status(404).json({error : "Employee not found"});

        const leave = await LeaveModel.create({
            employeeId : employee._id,
            type : type,
            startDate: new Date(startDate),
            endDate : new Date(endDate),
            reason
        });

         await inngest.send({
                        name:"leave/pending",
                        data: {
                            leaveId : leave._id
                        }
                    })
        
        return res.status(201).json({success:true, message:"Leave applied successfully.", data : leave});
    }
    catch(err){
        console.error("Create Leave error", err.message);
        return res.status(500).json("Faild to Apply for leave");
    }
}

async function getLeaves(req, res) {
   try{
        const session = req.session;

        if(session.role ==="ADMIN"){
            const leaveLimit = req.query;

            const leaves = await LeaveModel.find().populate("employeeId").sort({
                createdAt : -1
            }).limit(leaveLimit || 30);

            return res.status(200).json({success:true, data:leaves})
        }
        else{
            const employee = await EmployeeModel.findOne({
                userId : session.userId
            });

            if(!employee) return res.status(404).json({error : "Employee not found"});

            const leaves =await LeaveModel.find({employeeId : employee._id}).sort({createdAt : -1});

            return res.status(200).json({success:true, data:leaves})

        }
   }
   catch(err){
        console.error("Get Leave error", err.message);
        return res.status(500).json("Faild to fetch leaves")
   }
}

async function updateLeave(req, res) {
    try{

        const {status} = req.body;
        if(!["APPROVED", "REJECTED", "PENDING"].includes(status)) return res.json(400).json({error: "Invalid status"})

        const id = req.params.id;
        if(!id) return res.status(400).json({error: "Invaild leave Id"})

        const session = req.session;

        const updatedLeave = await LeaveModel.findByIdAndUpdate(id, {status}, {returnDocument: "after"}).populate("employeeId");

        const employee = updatedLeave.employeeId

        const mail = `<div style="max-width: 600px;">
                      <h2>Hi ${employee.firstName}, 👋</h2>
                      <p style="font-size: 16px;">Your leave application id: ${updatedLeave._id} have been ${updatedLeave.status}.</p>
                      <p style="font-size: 14px;">Start date: ${new Date(updatedLeave.startDate).toLocaleDateString()}</p>
                      <p style="font-size: 14px;">End date: ${new Date(updatedLeave.endDate).toLocaleDateString()}</p>
                      <p style="font-size: 14px;">Reason: ${updatedLeave.reason}.</p> 
                      <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
                      <p style="font-size: 16px;">Best Regards,</p>
                      <p style="font-size: 16px;">EMS</p>
                  </div>`

        sendEmail(updatedLeave?.employeeId?.email ,"Leave application updated!", mail)

        return res.status(200).json({success:true, message: "Update status successfully."})

    }catch(err){
        console.error("UpdateLeave error", err.message)
        return res.status(500).json("Failed to update leave")
    }
    
}

module.exports = {createLeave, getLeaves, updateLeave}