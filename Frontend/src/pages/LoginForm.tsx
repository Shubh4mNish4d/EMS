import { ArrowLeft, Eye, EyeOff, Loader2Icon } from 'lucide-react';
import { useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../utils/error';

const LoginForm = ({title, subtitle}: {title :string ; subtitle : string}) => {
  
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const {login} = useAuth();

  async function submitHandler(e:React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    try{
      setloading(true)
      await login(email, password)
      toast.success('Login Successfully!')
    }catch(err:unknown){
      toast.error(getErrorMessage(err, "Login failed"))
    }
    finally{
      setloading(false)
    }  
  }

  return (
    <div className='w-full md:w-md '>
      <Link className='flex items-center gap-2 text-slate-400 text-sm mb-6 hover:text-slate-800 duration-100' to="/login">
        <ArrowLeft className='inline-block size-4'></ArrowLeft>
        <p> Back to portals</p>
      </Link>

      <h3 className='text-3xl font-medium mb-2'>{title}</h3>
      <p className='mb-8 text-sm text-slate-600 font-base'>{subtitle}</p>

      <form onSubmit={submitHandler}>
          <div className='md:mb-2 mb-4'>
            <label htmlFor="email" className='text-sm' >Email Address</label>
            <input type="text" id="email" className='md:w-110 w-full block mt-1' placeholder='example@example.com' 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
          </div>

          <div>
            <label htmlFor="password" className='text-sm'>Password</label>
            <div className='relative'>
              <input type={hidePassword ? "password" : "text"} id="password" className='md:w-110 w-full block mt-1' placeholder='..........'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
              { hidePassword ? <Eye  className='absolute top-3 right-5 size-5  cursor-pointer text-slate-500 hover:text-slate-800' onClick={()=>setHidePassword(false)}/> : <EyeOff className='absolute top-3 right-5 size-5 cursor-pointer text-slate-500 hover:text-slate-800' onClick={()=>setHidePassword(true)}/>}
            </div>
          </div>
          <div>
            <button className='btn-primary md:w-110 w-full mt-8 flex justify-center md:mt-5 cursor-pointer'>{loading ?  <Loader2Icon className=' animate-spin size-5'></Loader2Icon>: "Submit"} </button> 
          </div>
      </form>
    </div>
  )
}

export default LoginForm;
