import { useCallback, useEffect, useState } from "react";
import Loader from "../components/Loader";
import LeaveStats from "../components/LeaveStats";
import { Plus } from "lucide-react";
import LeaveTable from "../components/LeaveTable";
import type { leaveDataInterface } from "../Types/DataTypes";
import LeaveForm from "../components/LeaveForm";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const Leave = () => {
  const [Loading, setLoading] = useState<boolean>(true);
  const [Leaves, setLeaves] = useState<leaveDataInterface[]>([]);
  const [FormOpen, setFormOpen] = useState<boolean>(false);
  const {user} = useAuth()

  const fetchLeaves = useCallback(async ()=>{
      try{
        const {data} = await api.get("/leave");
        setLeaves(data.data);
      }
      catch(err){
        toast.error(err.response.data.error || err.message || "Fetch leaves failed!")
      }
      finally{
        setLoading(false)
      }
  },[]);

  useEffect(()=>{ 
     fetchLeaves()
  },[]);

  const isAdmin:boolean = user?.role === "ADMIN" ? true : false;

  if(Loading) return <div className="w-full h-full"><Loader></Loader></div>;

  return (
    <div>

      {FormOpen && <LeaveForm setFormOpen={setFormOpen} fetchLeaves={fetchLeaves}></LeaveForm>}

       <div className="grid  justify-between items-center grid-cols-1 md:grid-cols-2 page-header gap-4">
          <div className="">
            <h1 className="page-title">Leave Management</h1>
            <p className="page-subtitle">{isAdmin ? "Manage leave applications": "Your leave history and requests"}</p>
          </div>
          <div className="md:flex md:justify-end">
             {!isAdmin &&  <button className="btn w-full md:w-fit h-fit justify-center btn-primary flex items-center gap-2 cursor-pointer" onClick={()=>setFormOpen(true)}><Plus className="size-4"></Plus> Apply for Leave</button>}
          </div>
       </div>

        {!isAdmin && <LeaveStats leaves={Leaves}></LeaveStats>}

        <LeaveTable fetchLeaves={fetchLeaves} leaves={Leaves} isAdmin={isAdmin}></LeaveTable>
    </div>
  )
}

export default Leave;
