import type { PayslipDataInterface } from "../Types/DataTypes";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { format } from "date-fns";

const PayslipTable = ({isAdmin ,Payslips} : {isAdmin: boolean ; Payslips:PayslipDataInterface [] | null}) => {


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
                            PERIOD
                        </th>
                        <th>
                            BASIC SALARY
                        </th>
                        <th>
                            NET SALARY
                        </th>
                        <th className="text-center">
                            ACTION
                        </th>
                    </tr>
                </thead>
                <tbody>     
                    {Payslips === null || !Payslips || Payslips?.length === 0 ? (<tr> <td colSpan={isAdmin ? 5 : 4} className='text-center text-slate-400'>No Payslip applications found</td> </tr> ):

                    (Payslips?.map(
                        
                        (Payslip)=>{

                            return <tr key={Payslip.id || Payslip._id}>
                               {isAdmin &&  <td className='px-6 py-4 font-medium text-slate-900'>
                                    {Payslip.employeeId?.firstName} {Payslip.employeeId?.lastName}
                                </td>}

                                 <td className='px-6 py-4 text-slate-500'>                                 
                                   {format(new Date(Payslip.year, Payslip.month-1),"MMMM yyyy")}
                                </td>

                                 <td className='px-6 py-4  text-slate-500'>
                                    ₹ {Payslip.basicSalary.toLocaleString()} 
                                </td>

                                 <td className='max-w-xs  text-slate-700 font-medium' >
                                    ₹ {Payslip.netSalary.toLocaleString()}
                                </td>


                               <td className='px-6 py-4 text-center'>
                                    <Link target="_blank" to={`/print/payslips/${(Payslip._id || Payslip.id)}`} className="inline-flex gap-2 items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10">
                                      <Download className="size-3"></Download> Download
                                    </Link>
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

export default PayslipTable;
