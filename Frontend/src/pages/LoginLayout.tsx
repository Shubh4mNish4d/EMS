import {  Outlet } from 'react-router-dom'

const LoginLayout = () => {
  return (
    <div className='w-full min-h-screen justify-center items-center flex flex-col md:flex-row '>
        <div className='md:w-1/2 hidden md:flex min-h-screen bg-indigo-950 flex-col justify-center pl-20 relative'>
          <div className='absolute -top-30 -left-30 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl'>

          </div>
          <div className=''>
              <h1 className='text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight tracking-tight'>Employee <br /> Management System</h1>
              <p className='text-slate-400 text-lg max-w-md leading-relaxed'>Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.</p>
          </div>
        </div>

        <div className='md:w-1/2 w-full flex p-5 justify-center flex-col items-center '>
           <Outlet></Outlet>
        </div>
    </div>
  )
}

export default LoginLayout
