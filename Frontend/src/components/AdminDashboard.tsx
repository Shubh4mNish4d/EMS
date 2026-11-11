import { Building2Icon, CalendarIcon, FileTextIcon, UsersIcon } from "lucide-react";
import type { AdminDashboardDataInterface } from "../Types/DataTypes";


const AdminDashboard = ({data}:{data :AdminDashboardDataInterface }) => {

  const cardsData = [{
    title : "Total Employees",
    value : data.totalEmployees,
    icon : UsersIcon
  },{
    title : "Departments",
    value : data.totalDepartments,
    icon : Building2Icon
  },{
    title : "Today's Attendance",
    value : data.todaysAttendance,
    icon : CalendarIcon
  },{
    title : "Pending Leaves",
    value : data.pendingLeaves,
    icon : FileTextIcon
  }
]
  return (
    <div className="animate-fade-in ">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, Admin — here's your overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-5 gap-4">
          {cardsData.map((cardData)=><div className="relative card card-hover flex p-5 md:p-6 justify-between items-center group cursor-pointer overflow-hidden" key={cardData.title}>

            <div className="absolute w-1 bg-slate-500/70 group-hover:bg-indigo-500/70 duration-200 transition-colors h-full left-0 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-slate-700">{cardData.title}</p>
              <p className="text-slate-900 mt-1 font-bold text-2xl">{cardData.value}</p>
            </div>
            <div>
              {<cardData.icon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-50 duration-200 transition-colors"></cardData.icon>}
            </div>
          </div>)}
      </div>
    </div>
  )
}

export default AdminDashboard;
