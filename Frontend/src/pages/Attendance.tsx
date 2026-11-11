import { useCallback, useEffect, useState } from "react";
import Loader from "../components/Loader";

import AttendanceStats from "../components/AttendanceStats";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceBtn from "../components/AttendanceBtn";
import type { AttendanceDataInterface } from "../Types/DataTypes";
import api from "../api/axios";
import toast from "react-hot-toast";

const Attendance = () => {

  const [loading, setloading] = useState(true);
  const [history, sethistory] = useState<AttendanceDataInterface[]>([]);

  const fetchAttendanceData = useCallback(async ()=>{
      try{
        const {data} = await api.get("/attendance");
        sethistory(data.data)

      }
      catch(err){
        toast.error(err.response.data.error || err.message || "Fetch attendance failed!");
      }
      finally{
        setloading(false)
      }
  },[])

  useEffect(()=>{
      fetchAttendanceData()
  },[fetchAttendanceData]);

  if(loading) return <div className="w-full h-full"><Loader></Loader></div>;

  const today = new Date();
  today.setHours(0,0,0,0);
  
  const todayRecord = history.find((H=> new Date(H.date).toDateString() === today.toDateString()));

  return (
    <div className="animate-fade-in relative pb-35 md:pb-0">
      
      {/* Heading */}
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track your work hours and daily check-ins</p>
      </div>

      {/* stats */}
      <div>
          <AttendanceStats history={history}></AttendanceStats>
      </div>

      {/* Attendance table */}
      <div>
        <AttendanceTable history={history}></AttendanceTable>
      </div>

      {/* Button */}
      <AttendanceBtn todayRecord={todayRecord} fetchAttendanceData = {fetchAttendanceData}></AttendanceBtn>

    </div>
  )
}

export default Attendance;
