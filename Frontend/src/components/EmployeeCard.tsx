import { Pencil, Trash } from "lucide-react";
import React from "react";
import type { EmpDataInterfase } from "../Types/DataTypes";


const EmployeeCard = ({empData, onEdit, onDelete}:{empData :EmpDataInterfase ; onEdit : (empData: EmpDataInterfase) => void ;onDelete :(empData:EmpDataInterfase)=> void }) => {

  return (
    <div className='card card-hover animate-slide-up relative group overflow-hidden'>

        {/* Edit and Delete buttons  */}

        <div className="hidden lg:flex absolute top-0 left-0 h-full w-full inset-0 bg-linear-to-t from-indigo-700/20 via-transparent to-transparent opacity-0 group-hover:opacity-100  transition-opacity  items-end justify-center pb-6 gap-3 z-10 duration-200"></div>
        
        <div className="absolute right-16 bottom-6 z-15 lg:opacity-0 group-hover:opacity-100 duration-200 text-slate-700 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg transition-all hover:scale-105 active:scale-105 hover:text-indigo-500 active:text-indigo-500 cursor-pointer" onClick={()=>{onEdit(empData)}} ><Pencil size={17}/></div>

        <div className="absolute right-4 bottom-6 z-15 lg:opacity-0 group-hover:opacity-100 duration-200 text-slate-700 p-2.5 bg-white/90 rounded-xl shadow-lg transition-all hover:scale-105 hover:text-red-500 active:text-red-500 active:scale-105 cursor-pointer" onClick={()=>{onDelete(empData)}}><Trash size={17}/></div>
        
       <div className="z-1">
            <div className="h-54 bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center relative">
                <div className="absolute top-4 left-4 text-[11px] font-semibold bg-white/90 backdrop-blur-sm shadow-sm px-2.5 py-1 text-slate-600 rounded-lg">
                    <p>{empData.department}</p>
                </div>

                {empData.employeeStatus === "INACTIVE" && <div className="absolute top-4 left-26 text-[11px] font-semibold bg-red-500 backdrop-blur-sm shadow-sm px-2.5 py-1 text-white rounded-lg">
                    <p className="">{empData.employeeStatus}</p>
                </div>}
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-100 to-slate-100 flex items-center justify-center text-2xl font-medium text-indigo-400 uppercase">
                {empData.firstName.charAt(0)} {empData.lastName.charAt(0)}
                </div>
            </div>
            <div className="p-5">
                <h5 className=""> {empData.firstName} {empData.lastName}</h5>
                <p className="text-slate-400 text-xs font-medium">{empData.position}</p>
            </div>
       </div>
    </div>
  )
}

export default React.memo(EmployeeCard);
