import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import LoginLayout from "./pages/LoginLayout"
import LoginHome from "./pages/LoginHome"
import LoginForm from "./pages/LoginForm"
import AppLayout from "./pages/AppLayout"
import Dashboard from "./pages/Dashboard"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import Payslips from "./pages/Payslips"
import Settings from "./pages/Settings"
import Employees from "./pages/Employees"
import PrintPaySlip from "./pages/PrintPaySlip"
import { useAuth } from "./contexts/AuthContext"
import type { ProfileDataInterface } from "./Types/DataTypes"


function App() { 
  const {user}:{user:ProfileDataInterface | null} = useAuth()



  return (
    <>  
      <Toaster />
      <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace></Navigate> :<LoginLayout></LoginLayout>}>
              <Route index element={<LoginHome></LoginHome>}></Route>
              <Route path="/login/admin" element={<LoginForm title="Admin Portal" subtitle={"Sign in to manage the organization"} ></LoginForm>}></Route>
              <Route path="/login/employee" element={<LoginForm title="Employee Portal" subtitle={"Sign in to access your account"}></LoginForm>}></Route>
          </Route>

          <Route element={<AppLayout></AppLayout>}>
              <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
              <Route path="/employees" element={<Employees></Employees>}></Route>
              <Route path="/attendance" element={<Attendance></Attendance>}></Route>
              <Route path="/leave" element={<Leave></Leave>}></Route>
              <Route path="/payslips" element={<Payslips></Payslips>}></Route>
              <Route path="/Settings" element={<Settings></Settings>}></Route>
          </Route>

          <Route path="/print/payslips/:id" element={<PrintPaySlip></PrintPaySlip>}></Route> 
          <Route path="*" element={<Navigate to="/dashboard" replace></Navigate>}></Route>
      </Routes>
    </>
  )
}

export default App
