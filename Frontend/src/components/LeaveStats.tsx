import { Thermometer, TreePalm, Umbrella } from "lucide-react";
import type { leaveDataInterface } from "../Types/DataTypes";


const LeaveStats = ({leaves} : {leaves : leaveDataInterface[]}) => {
    
    const totalSickLeave = leaves.filter((leave)=> leave.type =="SICK" ).length;
    const totalAnnualLeave = leaves.filter((leave)=> leave.type =="ANNUAL" ).length;
    const totalCasualLeave = leaves.filter((leave)=> leave.type =="CASUAL" ).length;

   const cardsData = [{
        title : "Sick Leave",
        value : totalSickLeave,
        icon : Thermometer
    },{
        title : "Annual Leave",
        value : totalAnnualLeave,
        icon : Umbrella
    },{
        title : "Casual Leave",
        value : totalCasualLeave,
        icon : TreePalm
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
                    <p className="text-slate-900 lg:mt-1 font-bold text-2xl">{cardData.value} <span className="text-sm text-slate-400 font-normal">taken</span></p>
                    </div>
                </div>)}
            </div>
        </div>
    )
    
}
export default LeaveStats;
