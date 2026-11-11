import  { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AdminDashboard from '../components/AdminDashboard';
import {type AdminDashboardDataInterface, type EmployeeDashboardDataInterface } from '../Types/DataTypes';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {

  const [loading, setLoading] = useState<boolean>(true)
  const [employeeData, setemployeeData] = useState<EmployeeDashboardDataInterface  | null>(null);
  const [adminData, setadminData] = useState<AdminDashboardDataInterface  | null>(null);

  useEffect(()=>{
    async function getDashboard(){
       try{
          const {data} = await api.get("/dashboard");
          if(data.data.role ==="ADMIN"){
            setadminData(data.data)
          }
          else{
            setemployeeData(data.data)
          }   
        }
        catch(err){
          toast.error( err.response.data.error|| err.message ||"Fetch dashboard data failed")
        }
        finally{
          setLoading(false)
        }
    }
    getDashboard()
  },[])

  if(loading) return <div className='h-full w-full'><Loader></Loader></div>;

  if(!employeeData && !adminData) return <div>Not data found</div>;

  if(adminData){
    return(<div>
      <AdminDashboard data={adminData}></AdminDashboard>
    </div>)
  }
  else{
    return(<div>
      <EmployeeDashboard data={employeeData}></EmployeeDashboard>
    </div>)
  } 
}

export default Dashboard;
