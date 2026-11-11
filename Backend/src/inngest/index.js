const AttendanceModel = require( "../models/Attendance.model");
const EmployeeModel = require("../models/Employe.model") ;
const LeaveModel = require("../models/Leave.model") ;
const { sendEmail } = require("../services/email.service");
const { Inngest } = require("inngest");

// Create a client to send and receive events
 const inngest = new Inngest({ id: "ems" });

// Auto clock out function:
const autoClockOut = inngest.createFunction(
  { id: "auto-clock-out", triggers: [{ event: "employee/clock-out" }] },

  async ({ event, step }) => {

    const {employeeId, attedanceId} = event.data;

    await step.sleepUntil("wait-for-9-hours", new Date(new Date().getTime()+ 9*60*60*1000));

    let attendance = await AttendanceModel.findById(attedanceId)

    if(!attendance?.checkOut){
        const employee = await EmployeeModel.findById({employeeId});

        // send Email

        const mail  =`<div style="max-width: 600px;">
                      <h2>Hi ${employee.firstName}, 👋</h2>
                      <p style="font-size: 16px;">You have a check-in in ${employee.department} today:</p>
                      <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${attendance?.checkIn?.toLocaleTimeString()}</p>
                      <p style="font-size: 16px;">Please make sure to check-out in one hour.</p>
                      <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
                      <br />
                      <p style="font-size: 16px;">Best Regards,</p>
                      <p style="font-size: 16px;">EMS</p>
                  </div>`

        await sendEmail(employee.email, "Attendance Check-Out Remainder!", mail);

        // wait for 1 more hour than auto clock-out

        await step.sleepUntil("wait-for-1-more-hour",  new Date(new Date().getTime()+ 1*60*60*1000))

        let attendance = await AttendanceModel.findById(attedanceId);

        if(!attendance?.checkOut){

            attendance.checkOut = new Date(attendance.checkIn).getTime()+ 4*60*60*1000 };
            attendance.status = "LATE";
            attendance.workingHours = 4;
            attendance.dayType = "Half Day"

            await attendance.save();
    };
  },
);


// Leave apllication approval reminder function:
const pendingLeaveApplicationReminder = inngest.createFunction({ id: "pending-leave-application-reminder", triggers: [{ event: "leave/pending" }] },
  async ({event, step})=>{

    const leaveId = event.data;

    await step.sleepUntil("wait-for-24-hours", new Date(new Date().getTime() + 24 *60* 60* 1000));

    const leave = await LeaveModel.findById(leaveId);

    if(leave.status === "PENDING"){

      const employee =await EmployeeModel.findbyId(leave.employeeId);

      // send email to admin...

      const mail = `  <div style="max-width: 600px;">
                          <h2>Hi Admin, 👋</h2>
                          <p style="font-size: 16px;">You have a leave application in ${employee.department} today:</p>
                          <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${leave?.startDate?.toLocaleDateString()}</p>
                          <p style="font-size: 16px;">Please make sure to take action on this leave application.</p>
                          <br />
                          <p style="font-size: 16px;">Best Regards,</p>
                          <p style="font-size: 16px;">EMS</p>
                      </div>`

      await sendEmail(process.env.ADMIN_EMAIL, "Leave Application Remainder!", mail);

    }
  }
);


const attendanceReminderCron = inngest.createFunction({ id: "attendance-reminder-cron", triggers: [{ cron: "30 4 * * *" }] },async ({step})=>{

  //  step 1 get today date range
  const today = await step.run("get-today-date", ()=>{
      const startUTC = new Date(new Date().toLocaleDateString("en-CA", {timeZone :"Asia/Kolkata"}) + "T00:00:00 + 05:30");

      const endUTC = new Date(startUTC.getTime() + 24*60*60*1000);

      return {startUTC : startUTC.toISOString(), endUTC : endUTC.toISOString()}
  });

  // Get active and not deleted employee
  const activeEmployee = await step.run("active-employee",async ()=>{
      const employees = await EmployeeModel.find({isDeleted : false, employeeStatus : "ACTIVE"});
      return employees;
  });

  // Get employee who are in approved leave today
  const onLeaveEmp = await step.run("on-leave-emp", async ()=>{
    const leaves = await LeaveModel.find({status:"APPROVED", startDate: {$lt : new Date(today.endUTC)}, endDate : {$gtn : new Date(today.startUTC)}});
    return leaves.map((l)=>l.employeeId);
  });

  // Get employee who are clock today
  const clockInEmp = await step.run("clock-in-emp", async ()=>{
    const attendance = await AttendanceModel.find({ date: {$lt : new Date(today.startUTC), $gtn : new Date(today.endUTC)}});
    return attendance.map((a)=>a.employeeId);
  });

  const absentEmployee = activeEmployee.filter((ae)=> !onLeaveEmp.includes(ae._id) && !clockInEmp.includes(ae._id));

  if(absentEmployee.length > 0){
      await step.run("send-email-to-absent-employee", ()=>{
        //send email 
        

        absentEmployee.forEach(async (emp) => {

            const mail = ` <div style="max-width: 600px; font-family: Arial, sans-serif;">
                                <h2>Hi ${emp.firstName}, 👋</h2>
                                <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
                                <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
                                <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
                                <br />
                                <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
                                <br />
                                <p style="font-size: 16px;">Best Regards,</p>
                                <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
                            </div>`
            await sendEmail(emp.email, "Attendance Remainder - Please Mark Your Attendance!", mail)
        });

      })
  }
})


// Create an empty array where we'll export future Inngest functions
const funs  = [autoClockOut,attendanceReminderCron, pendingLeaveApplicationReminder];

module.exports = {inngest, funs};