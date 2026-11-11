import { Calendar, CircleAlert, Clock } from "lucide-react"
import type { AttendanceDataInterface } from "../Types/DataTypes";

const AttendanceStats = ({history}:{history :AttendanceDataInterface[]}) => {

  const totalPresent = history.filter((H :AttendanceDataInterface)=> H.status === "PRESENT").length;
  const totalLate = history.filter((H:AttendanceDataInterface)=> H.status === "LATE").length;

  const cardsData = [{
    title : "Days Present",
    value : totalPresent,
    icon : Calendar
  },{
    title : "Late Arrivals",
    value : totalLate,
    icon : CircleAlert
  },{
    title : "Avg. Work Hrs",
    value : "8.5 Hrs",
    icon : Clock
  }]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
          {cardsData.map((cardData)=><div className="relative card card-hover flex p-5 md:p-6 gap-4 items-center group cursor-pointer overflow-hidden" key={cardData.title}>
            <div>
              {<cardData.icon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-50 duration-200 transition-colors"></cardData.icon>}
            </div>
            <div className="absolute w-1 bg-slate-500/70 group-hover:bg-indigo-500/70 duration-200 transition-colors h-full left-0 rounded-full"></div>
            <div>
              <p className="text-sm  text-slate-500">{cardData.title}</p>
              <p className="text-slate-900 mt-1 font-bold text-2xl">{cardData.value}</p>
            </div>
          </div>)}
      </div>
    </div>
  )
  
}

export default AttendanceStats;
