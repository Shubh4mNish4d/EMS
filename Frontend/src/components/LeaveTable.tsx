import { format } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import type { leaveDataInterface } from "../Types/DataTypes";
import api from "../api/axios";
import toast from "react-hot-toast";


const LeaveTable = ({leaves, isAdmin, fetchLeaves}: { leaves: leaveDataInterface[]; isAdmin: boolean; fetchLeaves:()=>void }) => {

  const [processing, setProcessing] = useState<boolean | null>(null);

  async function handleStatusUpdate(id:string, status:string){
     try{
        setProcessing(true)
        await api.patch(`/leave/${id}`,{"status": status} ,{
            headers: {
                'Content-Type': 'application/json'
                }
        });
        await fetchLeaves();
        toast.success("Update status successfully!")
     }
     catch(err){
        toast.error(err.response.data.error || err.message || "Create payslip failed")
     }
     finally{
        setProcessing(false)
     }
  }

  return (
    <div className="mt-8">
        <div className=" card overflow-y-scroll">
            <table className='table-modern'>
                <thead>
                    <tr>
                       {isAdmin &&  <th>
                            EMPLOYEE
                        </th>}
                        <th>
                            TYPE
                        </th>
                        <th>
                            DATES
                        </th>
                        <th>
                            REASON
                        </th>
                        <th>
                            STATUS
                        </th>
                       {isAdmin && <th className="text-center">
                            ACTION
                        </th>}
                    </tr>
                </thead>
                <tbody>     
                    {leaves === null || !leaves || leaves?.length === 0  ? (<tr><td colSpan={isAdmin ? 6 : 4} className='text-center text-slate-400'>No leave applications found</td></tr>):
                    (leaves?.map(
                        (leave)=>{
                            return <tr key={leave.id || leave._id}>
                                {isAdmin && <td className='px-6 py-4 font-medium text-slate-900'>
                                    {leave.employeeId?.firstName} {leave.employeeId?.lastName}
                                </td>}
                                <td className='px-6 py-4'>
                                    <span className="text-slate-600 badge bg-slate-100">{leave.type} </span>
                                </td>
                                <td className='px-6 py-4 text-xs  text-slate-500'>
                                    {format(new Date(leave.startDate),"MMM dd")} - {format(new Date(leave.endDate),"MMM dd, yyyy")} 
                                </td>
                                <td className='max-w-xs truncate text-slate-500' title={leave.reason}>
                                    {leave.reason}
                                </td>
                                <td className='px-6 py-4 '>
                                     <span className={`badge ${leave.status === "APPROVED" ? "badge-success" : leave.status === "PENDING" ? "badge-warning": "badge-danger" }`} >{leave.status}</span>
                                </td>
                               {isAdmin && <td className='px-6 py-4 '>
                                    {leave.status === "PENDING"  && <div className="flex gap-2 justify-center items-center">
                                        <button className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                                        disabled={!!processing}
                                        onClick={()=>handleStatusUpdate((leave.id || leave._id),"APPROVED")}>
                                          {processing === (leave.id || leave._id) ? <Loader2 className="w-4 h-4 animate-spin"> </Loader2> : <Check  className="w-4 h-4"></Check>}
                                        </button>

                                        <button className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                        disabled={!!processing}
                                         onClick={()=>handleStatusUpdate((leave.id || leave._id),"REJECTED")}>
                                          {processing === (leave.id || leave._id) ? <Loader2 className="w-4 h-4 animate-spin"> </Loader2> : <X  className="w-4 h-4"></X>}
                                        </button>
                                      </div>}
                                </td>}
                            </tr>})
                        )
                    }           
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default LeaveTable
