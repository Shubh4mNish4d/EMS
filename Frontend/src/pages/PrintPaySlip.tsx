import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { format } from "date-fns";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { PayslipDataInterface } from "../Types/DataTypes";


const PrintPaySlip = () => {

  const [Loading, setLoading] = useState<boolean>(true);
  const [Payslip, setPayslip] = useState<null | PayslipDataInterface>(null);

   const {id}  = useParams();

  const fetchPayslip = useCallback(async ()=>{
       try{
          const {data} = await api.get(`/payslip/${id}`);
          setPayslip(data.Payslip)
        }
        catch(err){
          toast.error(err.response.data.error || err.message || "fetch payslip failed")
        }
        finally{
          setLoading(false)
        }
  },[])

  useEffect(()=>{
    fetchPayslip();
  },[])


  if(Loading) return <div className="w-full h-screen"><Loader></Loader></div>

  if(!Payslip) return <div className="w-full h-screen flex justify-center items-center">No payslip found</div>

  return (
    <div className="">
        <div className="max-w-2xl mx-auto animate-fade-in p-8">
          <div className="text-center border-b border-slate-200 pb-6 mb-8">
              <h1 className="font-bold text-2xl tracking-tight mb-1">PAYSLIP</h1>
              <p className="text-slate-500 text-sm">{format(new Date(Payslip.year, Payslip.month-1),"MMMM yyyy")}</p>
          </div>

          <div className="grid grid-cols-2 gap-6  gap-x-30 mb-8 p-3">
            <div className="">
              <h6 className="text-xs mb-1 uppercase tracking-wider text-slate-400">Employee Name</h6>
              <p className="font-semibold">{Payslip.employeeId?.firstName} {Payslip.employeeId?.lastName}</p>
            </div>

            <div className="">
              <h6 className="text-xs mb-1 uppercase tracking-wider text-slate-400">Position</h6>
              <p className="font-semibold">{Payslip.employeeId?.position}</p>
            </div>

            <div className="">
              <h6 className="text-xs mb-1 uppercase tracking-wider text-slate-400">Email</h6>
              <p className="font-semibold">{Payslip.employeeId?.email}</p>
            </div>

            <div className="">
              <h6 className="text-xs mb-1.5 uppercase text-slate-400">Period</h6>
              <p className="font-semibold">{format(new Date(Payslip.year, Payslip.month-1),"MMMM yyyy")}</p>
            </div>
            
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden mb-8 ">
            <table className="w-full text-sm">
              <thead className="uppercase">
                <tr className="bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">Description</th>
                  <th className=" py-3 px-4 text-xs text-slate-500 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="">
                <tr className="border-t border-slate-100">
                  <td className="py-3 px-4 text-slate-700">Basic Salary</td>
                  <td className="text-right py-3 px-4 text-slate-900 font-medium">₹ {Payslip.basicSalary.toLocaleString()}</td>
                </tr>

                 <tr className="border-t border-slate-100">
                  <td className="py-3 px-4 text-slate-700">Allowances</td>
                  <td className="text-right py-3 px-4 text-slate-900 font-medium">+₹ {Payslip.allowances.toLocaleString()}</td>
                </tr>

                 <tr className="border-t border-slate-100">
                  <td className="py-3 px-4 text-slate-700">Deductions</td>
                  <td className="text-right py-3 px-4 text-slate-900 font-medium">-₹ {Payslip.deductions.toLocaleString()}</td>
                </tr>

                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td className="py-4 px-4 font-bold text-slate-900">Net Salary</td>
                  <td className="text-right py-4 px-4 font-bold text-slate-900 text-lg">₹ {Payslip.netSalary.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className=" flex justify-center">
            <button className="btn btn-primary cursor-pointer print:hidden" onClick={()=>window.print()}>Print Payslip</button>
          </div>
        </div>
    </div>
  )
}

export default PrintPaySlip;
