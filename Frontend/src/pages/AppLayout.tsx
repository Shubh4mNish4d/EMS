import { ChevronRight, Settings, User, DollarSign, XIcon, Menu, LayoutGridIcon, UserIcon, CalendarIcon, FileTextIcon, SquareArrowRightExit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";
import Loader from "../components/Loader";
import type { ProfileDataInterface } from "../Types/DataTypes";
import { getErrorMessage } from "../utils/error";


const AppLayout = () => {
  const [profile, setprofile] = useState<null | ProfileDataInterface>(null);
  const [MobileOpen, setMobileOpen] = useState<boolean>(false);

  const {pathname} = useLocation();
  const {user,logout,loading, setLoading} = useAuth()

  useEffect(()=>{
   setLoading(true)
   async function getProfile() {
       try{
        const {data} = await api.get("/profile");
        setprofile(data.profile);
      }
      catch(err){
        toast.error(getErrorMessage(err, "Fetch profile data failed"))
      }
      finally{
        setLoading(false)
      }
   }

   getProfile()
  },[]);

  const NavItems = [
    {name: "Dashboard", link:"/dashboard" , icon : LayoutGridIcon},
    profile?.role === "ADMIN" ? {name: "Employees", link:"/employees" , icon : UserIcon} : {name: "Attendance", link:"/attendance" , icon : CalendarIcon},
    {name: "Leave", link:"/leave" , icon : FileTextIcon},
    {name: "Payslips", link:"/payslips" , icon : DollarSign},
    {name: "Settings", link:"/settings" , icon : Settings}
  ]

  function handleLogout(){
    logout();
    toast.success("Logout successfully");
  }

  if(loading) return <div className="w-full h-screen"><Loader></Loader></div>

  if(!user) return <Navigate to="/login"></Navigate>

  return (
    <div className="w-full min-h-screen flex relative">

      {/* Mobile Hamburger Menu Btn */}

      <div className="cursor-pointer fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10 lg:hidden"
      onClick={()=>setMobileOpen(true)}>
          <Menu size={20}/>
      </div>

      {/* Mobile Overlay */}

      {MobileOpen && <div className="z-50 w-full h-full left-0 top-0 absolute bg-black/50 backdrop-blur-md inset-0 lg:hidden " onClick={()=>setMobileOpen(false)}></div> }

      {/* SideBar */}
      <aside className={`bg-linear-180 z-60 from-[#0F172B] to-[#020618] lg:w-65 w-70 lg:relative lg:translate-0 flex flex-col text-white absolute duration-400 min-h-full ${MobileOpen ? "translate-x-0" : "-translate-x-full"}`}> 

        <div className="flex-1">
           <div className="pb-5 px-5 pt-6 flex justify-between items-center border-b border-white/8">
            <div className="flex gap-3 items-center">
                <div>
                  <User className="size-7"></User>
                </div>
                <div>
                  <h5 className="text-[13px] tracking-wide">Employee MS</h5>
                  <p className="text-[11px] text-slate-500 font-medium">Management System</p>
                </div>
            </div>
            <div className="text-slate-400 hover:text-white p-1 cursor-pointer lg:hidden"
            onClick={()=>setMobileOpen(false)}>
                <XIcon size={20}></XIcon>
            </div>
          </div>

          {/* User Details */}
          <div className="py-4 px-3">
            <div className="bg-white/3 rounded-lg border border-white/5 flex gap-3 p-3 items-center">
                <div className="bg-[#1D293D] rounded-lg border border-white/8 w-9 h-9 flex text-xs items-center justify-center text-slate-400 ">
                    {profile?.firstName[0]}
                </div>
                <div>
                    <h6 className="text-[13px] font-medium truncate">{profile?.firstName} {profile?.lastName}</h6>
                    <p className="text-[11px] text-slate-500">{profile?.role === "ADMIN" ? "Administration" : "Employee"}</p>
                </div> 
            </div>
          </div>

          {/* Navigation */}

          <div className=""> 
            <div className="px-5 py-2 ">
              <h6 className="text-[10px] tracking-widest text-slate-500 font-semibold">NAVIGATION</h6>
            </div>
            
            <nav className="px-3 space-y-0.5 overflow-y-auto">
              
              {NavItems.map((item)=>{
                const isActive = pathname.startsWith(item.link)

                return (<Link key={item.name} to={item.link} className={`group flex justify-between duration-100 px-3 py-2.5 rounded-sm items-center relative ${isActive ? "bg-[#615FFF1F] text-indigo-300" : "text-slate-300 hover:text-white hover:bg-white/4"}`} >
                    {isActive && <div className=" absolute w-0.75 h-5 bg-indigo-600 rounded-r-xl left-0" />}
                      <div className="flex gap-3 text-[13px] font-medium items-center">
                        <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-300"}`}/>
                          {item.name}
                      </div>
                      <div>
                        {isActive && <ChevronRight  className="text-[#615FFF80] size-3"/>}
                      </div>
                  </Link>)
              })}
            </nav>
          </div>
        </div>
        
        {/* Logout Btn */}
        <div className="p-3 border-t border-white/8 "> 
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium hover:bg-rose-500/8 hover:text-rose-400 px-3 py-2.5 cursor-pointer duration-150"
          onClick={handleLogout}>
            <SquareArrowRightExit className="size-4 "/>
            <p>Log out</p>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-4 pt-17  lg:p-8 h-screen overflow-y-auto">
          <Outlet></Outlet>
      </main>
      
    </div>
  )
}

export default AppLayout;

