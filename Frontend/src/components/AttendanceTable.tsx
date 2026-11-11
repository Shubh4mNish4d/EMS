import {format} from "date-fns"
import { getDayTypeDisplay, getWorkingHoursDisplay } from '../assets/assets'
import type { AttendanceDataInterface } from "../Types/DataTypes";

const AttendanceTable = ({history}:{history:AttendanceDataInterface[]}) => {
  return (
    <div className='card mt-8'>
        <div className='p-5'>
            <div><h3 className='font-semibold text-md'>Recent Activity</h3></div>
        </div>
        <div className="max-h-65 overflow-y-scroll">
            <table className='table-modern'>
                <thead>
                    <tr>
                        <th>
                            Date
                        </th>
                        <th>
                            CHECK IN
                        </th>
                        <th>
                            CHECK OUT
                        </th>
                        <th>
                            WORKING HOURS
                        </th>
                        <th>
                            DAY TYPE
                        </th>
                        <th>
                            STATUS
                        </th>
                    </tr>
                </thead>
                <tbody>     
                    {history?.length === 0 ? (<tr> <td colSpan={6} className='text-center text-slate-400'>No record found</td>  </tr> ):

                    (history?.map(
                        
                        (record)=>{

                            const dayType = getDayTypeDisplay(record);

                            return <tr key={record.id || record._id}>
                                <td className='px-6 py-4 font-medium text-slate-900'>
                                    {format(new Date(record.date),"MMM dd, yyyy")} 
                                </td>

                                 <td className='px-6 py-4  text-slate-600'>
                                    {record.checkIn ?  format(new Date(record.checkIn),"hh:mm a") : "-"} 
                                </td>

                                 <td className='px-6 py-4  text-slate-600'>
                                    {record.checkOut ?  format(new Date(record.checkOut),"hh:mm a") : "-"} 
                                </td>

                                 <td className='px-6 py-4 font-medium text-slate-600'>
                                    {getWorkingHoursDisplay(record)}
                                </td>

                                 <td className='px-6 py-4 '>
                                    {dayType.label !== "-" ? <span className={`badge ${dayType.className}`} >{dayType.label}</span> : "-"}
                                </td>

                                <td className='px-6 py-4 '>
                                    <span className={`badge ${record.status === "PRESENT" ? "badge-success" : record.status === "LATE" ? "badge-warning": "badge-danger" }`} >{record.status}</span>
                                </td>
                            </tr>})
                        )
                    }           
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default AttendanceTable
