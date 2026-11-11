import { ArrowRight, Calendar, DollarSign, FileTextIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { EmployeeDashboardDataInterface } from "../Types/DataTypes";


const EmployeeDashboard = ({data} : {data : EmployeeDashboardDataInterface | null}) => { 

  const cardsData = [{
    title : "Days Present",
    value : data?.totalDaysPresent,
    icon : Calendar
  },{
    title : "Pending Leaves",
    value : data?.totalPendingLeaves,
    icon : FileTextIcon
  },{
    title : "Latest Payslip",
    value : data?.latestPayslip ? `₹ ${data.latestPayslip?.netSalary?.toLocaleString()}` : "N/A",
    icon : DollarSign
  }
]
  return (
    <div className="animate-fade-in ">
      <div className="page-header">
        <h1 className="page-title">Welocome, {data?.employee?.firstName}!</h1>
        <p className="page-subtitle"> {data?.employee?.position} - {data?.employee?.department}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5 gap-4">
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
 
      <div className="mt-8 flex gap-3 flex-col md:flex-row">
        <Link to="/attendance" className="btn-primary text-center inline-flex items-center justify-center gap-2">Mark Attendance <ArrowRight className="size-4"></ArrowRight></Link>

        <Link to="/leave" className="btn-secondary text-center inline-flex items-center justify-center gap-2">Apply for Leave</Link>
      </div>
    </div>
  )
}

export default EmployeeDashboard;
