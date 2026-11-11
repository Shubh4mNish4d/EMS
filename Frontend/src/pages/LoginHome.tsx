import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const LoginHome = () => {
  return (
     <div className=' w-full md:w-md text-center md:text-left'>
        <h3 className='text-3xl font-medium mb-3 '>Welcome Back</h3>
        <p className='text-sm text-slate-600 font-base'>Select your portal to securely access the system.</p>

        <Link className='bg-[#F8FAFC] group md:w-110 w-full  cursor-pointer border border-[#E2E8F0] rounded-sm hover hover:border-slate-400 duration-100 h-18 flex p-5 items-center justify-between mt-10 mb-4  hover:bg-indigo-50/50 ' to="/login/admin">
            Admin Portal
            <ArrowRight className="size-3 text-slate-400 group-hover:text-black duration-150" />
        </Link>

        <Link className='bg-[#F8FAFC] md:w-110 w-full group cursor-pointer border border-[#E2E8F0] rounded-sm hover hover:border-slate-600 duration-100 h-18 flex p-5 items-center justify-between hover:bg-indigo-50/50' to="/login/employee">
            Employee Portal
            <ArrowRight className="size-3 text-slate-400 group-hover:text-black duration-150" />
        </Link>

        <p className='mt-10 text-sm font-light text-slate-500 '>© {new Date().getFullYear()} Code Fusion Infotech. All rights reserved.</p>
    </div>
  )
}

export default LoginHome
