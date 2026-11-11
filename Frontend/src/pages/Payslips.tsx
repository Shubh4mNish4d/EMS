import {  Plus } from "lucide-react";
import PayslipTable from "../components/PayslipTable";
import Loader from "../components/Loader";
import { useCallback, useEffect, useState } from "react";
import type {  EmpDataInterfase, PayslipDataInterface } from "../Types/DataTypes";
import PayslipForm from "../components/PayslipForm";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const Payslips = () => {
  const [Loading, setLoading] = useState<boolean>(true);
  const [Payslips, setPayslips] = useState<PayslipDataInterface [] | null>(null);
  const [PayslipFormOpen, setPayslipFormOpen] = useState<boolean>(false);
  const [Employees, setEmployees] = useState<EmpDataInterfase[] | null>(null);
  const {user} = useAuth();


   const fetchPayslip = useCallback(async ()=>{
        try{
          const [payslipData, employeeData] =await Promise.all([api.get("/payslip"), api.get("/employee")]);
          setPayslips(payslipData.data.data);
          setEmployees(employeeData.data.result)
        }
        catch(err){
          toast.error(err.response.data.error || err.message || "Fetch payslips failed!")
        }
        finally{
          setLoading(false)
        }
   },[])

   useEffect(()=>{
    fetchPayslip()
   },[])


  const isAdmin:boolean = user?.role === "ADMIN" ? true : false;


  if(Loading) return <div className="w-full h-full"><Loader></Loader></div>
  return (
    <div>
      {/* Payslip Header */}
       <div className="grid justify-between items-center grid-cols-1 md:grid-cols-2 page-header gap-4">
          <div className="">
            <h1 className="page-title">Payslips</h1>
            <p className="page-subtitle">{isAdmin ? "Generate and manage employee payslips" : " Your payslip history" }</p>
          </div>
          <div className="md:flex md:justify-end">
             {isAdmin &&  <button className="btn w-full md:w-fit h-fit justify-center btn-primary mt-2 flex items-center gap-2 cursor-pointer" onClick={()=>setPayslipFormOpen(true)}><Plus className="size-4"></Plus> Generate Payslip</button>}
          </div>
       </div>
       
        {/* Payslip Table */}

       <PayslipTable  isAdmin={isAdmin} Payslips={Payslips}></PayslipTable>

        {/* Payslip Form */}

        {PayslipFormOpen && <PayslipForm fetchPayslip={fetchPayslip} setPayslipFormOpen={setPayslipFormOpen} Employees={Employees}></PayslipForm>}

    </div>
  )
}

export default Payslips;
