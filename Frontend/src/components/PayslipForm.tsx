import {  Loader2Icon, User2Icon, X } from "lucide-react"
import type { EmpDataInterfase } from "../Types/DataTypes";
import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";


const PayslipForm = ({setPayslipFormOpen, Employees, fetchPayslip}:{setPayslipFormOpen:React.Dispatch<React.SetStateAction<boolean>> ; Employees:EmpDataInterfase[] | null; fetchPayslip : ()=>void}) => {

  const [Processing, setProcessing] = useState<boolean>(false);

  async function submitHandler(e:React.SubmitEvent<HTMLFormElement>){
      e.preventDefault();
       try{
        setProcessing(true);
        const formData = new FormData(e.currentTarget);
        await api.post("/payslip",formData,{
            headers: {
                'Content-Type': 'application/json'
                }
        });
        setPayslipFormOpen(false)
        toast.success("Payslip created!");
        fetchPayslip();
       }
       catch(err){
        toast.error(err.response.data.error || err.message || "Create payslip failed");
       }
       finally{
        setProcessing(false)
       }
   }



  return (
   <div className=" w-full  items-center h-full backdrop-blur-sm bg-black/40 fixed z-100 top-0 left-0 flex justify-center p-4 md:py-16" onClick={()=>setPayslipFormOpen(false)}>
        <div className="max-w-lg w-full h-fit bg-white rounded-lg p-6" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg mb-1">Generate Monthly Payslip</h3>
                </div>
                <div>
                    <X className="size-8 duration-100 transition-colors rounded-md cursor-pointer text-slate-400 hover:bg-slate-100 p-1.5 hover:text-slate-600" onClick={()=>setPayslipFormOpen(false)}></X>
                </div>
            </div>
            <form onSubmit={submitHandler}  className="mt-6 text-sm font-medium text-slate-700 space-y-4">
              <div>
                <label htmlFor="Employee" className="mb-2 flex gap-2 items-center"><User2Icon className=" size-4 text-slate-400 "></User2Icon>Employee</label>
                <select required name="employeeId" className="cursor-pointer" id="Employee">
                  <option selected disabled >Select Employee</option>
                  {Employees?.map((employee)=>
                    <option value={(employee.id || employee._id)} key={(employee.id || employee._id)} >{employee?.firstName} {employee?.lastName}</option>
                  )}
                </select>
              </div>

              <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label htmlFor="Month" className="mb-2 flex gap-2 items-center">Month</label>
                        <select required name="month" className="cursor-pointer" id="Month">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">4</option>
                            <option value="3">5</option>
                            <option value="3">6</option>
                            <option value="3">7</option>
                            <option value="3">8</option>
                            <option value="3">9</option>
                            <option value="3">10</option>
                            <option value="3">11</option>
                            <option value="3">12</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="Year" className="mb-2 flex gap-2 items-center">Year</label>
                        <input required type="number" min="2000" defaultValue={new Date().getFullYear()} step={1} className="cursor-pointer" name="year"  id="Year" />
                    </div>
                  </div>
              </div>

              <div>
                    <label htmlFor="Basic Salary" className="mb-2 flex gap-2 items-center">Basic Salry</label>
                    <input required type="number" placeholder="8000" min="0" step={1} className="cursor-pointer" name="basicSalary" id="Basic Salry" />
              </div>

               <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label htmlFor="Allowances" className="mb-2 flex gap-2 items-center">Allowances</label>
                         <input required type="number" defaultValue="0" min="0" step="1" className="cursor-pointer" name="allowances" id="Allowances" />
                    </div>

                    <div>
                        <label htmlFor="Deductions" className="mb-2 flex gap-2 items-center">Deductions</label>
                          <input required type="number" defaultValue="0" min="0" step="1" className="cursor-pointer" name="deductions" id="Deductions" />
                    </div>
                  </div>
              </div>

              <div className=" flex gap-3 justify-end mt-7">
                <button className="btn cursor-pointer w-full md:w-fit text-center btn-secondary" onClick={()=>setPayslipFormOpen(false)}>Cancel</button>
                <button className="btn cursor-pointer w-full md:w-fit text-center btn-primary" disabled={Processing}>{Processing ? <span ><Loader2Icon className="animate-spin size-4 inline"></Loader2Icon> Generating...</span> :"Generate"}</button>
              </div>

            </form>
        </div>
    </div>
  )
}

export default PayslipForm
