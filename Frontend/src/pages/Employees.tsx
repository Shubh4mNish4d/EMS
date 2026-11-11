import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { DEPARTMENTS } from "../assets/assets";
import Loader from "../components/Loader";
import EmployeeCard from "../components/EmployeeCard";
import type { EmpDataInterfase } from "../Types/DataTypes";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";
import toast from "react-hot-toast";




const Employees = () => {

  const [employees , setEmployees] = useState<EmpDataInterfase[]>([]);
  const [Departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [searchInp, setSearchInp] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editEmployee, setEditEmployee] = useState<EmpDataInterfase | null>(null);
  const [isEditMode, setIsEditMode] =  useState<boolean>(true);
  const [filteredEmp, setfilteredEmp] = useState<EmpDataInterfase[] | null>(null);

  async function getEmployee(){
      try{
        if(selectedValue){
          setLoading(true);
          const {data} = await api.get(`/employee?department=${selectedValue}`);
            setEmployees(data.result);
            setfilteredEmp(data.result)
        }
        else{
           const {data} = await api.get(`/employee`);
            setEmployees(data.result)
            setfilteredEmp(data.result)
        }
      }
      catch(err:unknown){
        toast.error(err.response.data.error || err.response || "Fetch employees data failed")
      }
      finally{
        setLoading(false)
      }
  }

  async function onDelete(empData :EmpDataInterfase){
    const ans = confirm("Are you sure you want to delete this employee?");
    if(ans){
      try{
        await api.delete(`/employee/${empData.id}`);
        toast.success("Employee deleted successfully!");
        getEmployee();
      }
      catch(err){
        toast.error(err.response.data.error || err.message || "Delete employee failed");
        getEmployee();
      }
    }
  }

  useEffect(()=>{
    setDepartments(DEPARTMENTS);
  },[])

  useEffect(()=>{
    getEmployee();
  },[selectedValue])

  
  useEffect(()=>{
      if(searchInp){
          const filtered:EmpDataInterfase[] = employees.filter((emp)=> `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(searchInp.toLowerCase()));
          setfilteredEmp(filtered)
        }
        else{
          setfilteredEmp(employees)
        }
  },[searchInp])
     

  return (
    <div className="animate-fade-in">

        {/* forms */}
        {formOpen && <EmployeeForm getEmployee={getEmployee} isEditMode={false} initialData={null} setFormOpen={setFormOpen} setEditEmployee={null}></EmployeeForm>}

        {!!editEmployee && <EmployeeForm getEmployee={getEmployee}  isEditMode={isEditMode} initialData={editEmployee} setEditEmployee={setEditEmployee} setFormOpen={null}></EmployeeForm>}

        {/* content */}
        <div className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title"> Employees </h1>
            <p className="page-subtitle">Manage your team members</p>
          </div>
          <div >
              <button className="btn-primary flex gap-2 items-center cursor-pointer" onClick={()=>{setFormOpen(true)}}><Plus className="size-4"></Plus> Add Employee</button>
          </div>
        </div> 

        <div className=" flex gap-3 relative" >
          <Search className="absolute size-4 left-3.5 text-slate-400 top-3"></Search>

          <input type="text" name="" id="" className="pl-10 " placeholder="Search employees..."  value={searchInp} onChange={(e)=>setSearchInp(e.target.value)}/>

          <select name="" id="" className="w-40 cursor-pointer" value={selectedValue} onChange={(e)=>setSelectedValue(e.target.value)}>
              <option value="" >All Departments</option>
              {Departments.map((dept)=><option key={dept} value={dept} >{dept}</option>)}
          </select>
        </div>

        {loading ? <div className="w-full h-full flex-1 mt-35"><Loader></Loader></div> : 

          filteredEmp?.length==0 ? 
            <div className="w-full h-70 flex items-center justify-center border border-dashed mt-6 rounded-xl  border-slate-300 text-slate-400">No Employees found</div> :
              <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-6">
                  {filteredEmp?.map((empData)=> <EmployeeCard key={empData._id} empData={empData} onDelete = {onDelete} onEdit={(e)=>{setEditEmployee(e)}}></EmployeeCard>)}
              </div>
        }
    </div>
  )
}

export default Employees;
