import { Loader2Icon, X } from "lucide-react"
import React, { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { EmpDataInterfase } from "../Types/DataTypes";
import { DEPARTMENTS } from "../assets/assets";

const EmployeeForm = ({setFormOpen, setEditEmployee, initialData, isEditMode, getEmployee}:  {setFormOpen:React.Dispatch<React.SetStateAction<boolean>> | null; setEditEmployee: React.Dispatch<React.SetStateAction<EmpDataInterfase | null>> | null;  isEditMode : boolean; initialData:EmpDataInterfase | null; getEmployee:()=>void}) => {


    const departments:string[] = DEPARTMENTS;
    const [Processing, setProcessing] = useState<boolean>(false);


   async function submitHandler(e:React.SubmitEvent<HTMLFormElement>){
        setProcessing(true);
        e.preventDefault();

        const formdata = new FormData(e.currentTarget);

        if(isEditMode){
            const pwd = formdata.get("password");
            if(!pwd){formdata.delete("password")};
        }
             
        try{
            const url = isEditMode ? `/employee/${initialData?.id}` : "/employee"
            const method = isEditMode ? "patch" : "post";

            const {data} = await api[method](url, formdata,{
                headers: {
                'Content-Type': 'application/json'
                }
            } );
           toast.success(data.message);

           if(isEditMode){
            setEditEmployee(null)
           }
           else{
            setFormOpen(false)
           }
             
        }
        catch(err:unknown ){
            toast.error(err?.response?.data?.error || err?.response || "Create employee failed!")
        }
        finally{
            setProcessing(false);
            getEmployee();
        }
   }

  return (
    <div className="w-screen h-screen bg-black/50 inset-0 overflow-y-auto top-0 left-0 fixed z-100 flex justify-center backdrop-blur-sm p-4" onClick={()=> initialData ? setEditEmployee(null) :setFormOpen(false)}>

        <div className="w-full max-w-3xl rounded-2xl h-fit bg-white my-8 animate-fade-in " onClick={(e)=>e.stopPropagation()}>    
            <div className="flex justify-between items-center pb-0 p-6">
                <div>
                    <h3 className="text-lg font-semibold pb-1">{initialData ? "Edit Employee":" Add New Employee"}</h3>
                    <p className="text-sm text-slate-500 ">{initialData ? "Update employee details":"Create a user account and employee profile"}</p>
                </div>
                <div>
                    {setEditEmployee &&  <X onClick={()=>{setEditEmployee(null) }}  className="p-1.5 size-8 hover:bg-indigo-50 hover:text-slate-600 duration-100 cursor-pointer rounded-lg text-slate-400"/>}
                    {setFormOpen &&  <X onClick={()=>{setFormOpen(false) }}  className="p-1.5 size-8 hover:bg-indigo-50 hover:text-slate-600 duration-100 cursor-pointer rounded-lg text-slate-400"/>}
                </div>
            </div>

            <form action="" onSubmit={submitHandler}>
                <div className="p-6 space-y-6">   
                    <div className="p-6 card">
                        <h4 className="text-md font-medium border-b border-slate-100 pb-4">Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 text-slate-700 text-sm pt-5 gap-5"  >
                            <div >
                                <label htmlFor="firstName" className="pb-2 block">First Name</label>
                                <input required type="text" name="firstName" id="firstName" defaultValue={initialData?.firstName}/>
                            </div>
                            <div>
                                <label htmlFor="lastName" className="pb-2 block">Last Name</label>
                                <input required type="text" name="lastName" id="lastName" defaultValue={initialData?.lastName}/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="pb-2 block">Phone Number</label>
                                <input required type="text" name="phone" id="phone"  defaultValue={initialData?.phone}/>
                            </div>
                            <div>
                                <label htmlFor="joinDate" className="pb-2 block">Join Date</label>
                                <input required type="date" name="joinDate" id="joinDate" defaultValue={initialData?.joinDate ?  new Date(initialData?.joinDate).toISOString().split("T")[0] : ""}/>
                            </div>
                            <div className=" md:col-span-2">
                                <label htmlFor="bio" className="pb-2 block">Bio (Optional)</label>
                                <textarea name="bio" id="bio" className="h-22 resize-none" placeholder="Brief description..."  defaultValue={initialData?.bio}></textarea>
                            </div>
                        </div>
                    </div>
                    

                    <div className="p-6 card">
                        <h4 className="text-md font-medium border-b border-slate-200/70 pb-4">Employment Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 text-slate-700 text-sm pt-5 gap-5"  >
                            <div>
                                <label htmlFor="department" className="pb-2 block">Department</label>
                                <select required id="department" className="cursor-pointer" name="department" defaultValue={initialData?.department}>
                                    <option value="" disabled>Select Department</option>
                                    {departments?.map((dept)=>
                                        <option value={dept} >{dept}</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="position" className="pb-2 block">Position</label>
                                <input required type="text" name="position" id="position" defaultValue={initialData?.position}/>
                            </div>
                            <div>
                                <label htmlFor="basicSalary" className="pb-2 block">Basic Salary</label>
                                <input required type="number" name="basicSalary" id="basicSalary"  defaultValue={initialData?.basicSalary || "0"} />
                            </div>
                            <div>
                                <label htmlFor="allowances" className="pb-2 block">Allowances</label>
                                <input required type="number" name="allowances" id="allowances"  defaultValue={initialData?.allowances || "0"}/>
                            </div>
                            <div>
                                <label htmlFor="deductions" className="pb-2 block">Deductions</label>
                                <input required type="number" name="deductions" id="deductions"  defaultValue={initialData?.deductions || "0"}/>
                            </div>

                           {initialData &&  <div>
                                <label htmlFor="employeeStatus" className="pb-2 block">Status</label>
                                <select required id="employeeStatus" name="employeeStatus"  defaultValue={initialData?.employeeStatus} className="cursor-pointer">
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>}
                            
                        </div>
                    </div>

                    <div className="p-6 card">
                        <h4 className="text-md font-medium border-b border-slate-200/70 pb-4">Account Setup</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 text-slate-700 text-sm pt-5 gap-5"  >
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="pb-2 block">Work Email</label>
                                <input required type="email" name="email" autoComplete="off" id="email" defaultValue={initialData?.email || ""}/>
                            </div>
                           
                           {!initialData ?
                            <div>
                                <label htmlFor="TemporaryPassword" className="pb-2 block">Temporary Password</label>
                                <input required type="password"  name="password" id="TemporaryPassword" placeholder="" />
                            </div>:
                             <div>
                                <label htmlFor="password" className="pb-2 block">Change Password (Optional)</label>
                                <input required placeholder="Leave Blank to keep current" type="password" name="password" autoComplete="off" id="password" />
                            </div>}

                            <div>
                                <label htmlFor="SystemRole" className="pb-2 block">System Role</label>
                                <select required name="role" id="SystemRole" className="cursor-pointer">
                                    <option value="EMPLOYEE">Employee</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-3 justify-end mt-8">
                        
                        {setEditEmployee &&  <button className="btn-secondary cursor-pointer  w-full md:w-fit text-center" onClick={()=>setEditEmployee(null)}>Cancel</button>}

                        {setFormOpen &&  <button className="btn-secondary cursor-pointer w-full md:w-fit text-center" onClick={()=>setFormOpen(false)}>Cancel</button>}

                        {initialData ? <button className="btn-primary cursor-pointer w-full md:w-fit text-center" type="submit" disabled={Processing} >{Processing ? <span ><Loader2Icon className="animate-spin size-4 inline"></Loader2Icon> Updating...</span> :"Update Employee"}</button> :
                        <button className="btn-primary  w-full cursor-pointer md:w-fit text-center" type="submit" disabled={Processing} >{Processing ? <span ><Loader2Icon className="animate-spin size-4 inline"></Loader2Icon> Creating...</span> :"Create Employee"}</button>}       
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EmployeeForm
