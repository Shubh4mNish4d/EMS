import React, { useCallback, useEffect, useState } from 'react'
import Loader from '../components/Loader';
import { Loader2Icon, Lock, Save, User, X } from 'lucide-react';
import type { ProfileDataInterface } from '../Types/DataTypes';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const [Loading, setLoading] = useState<boolean>(true);
  const [FormOpen, setFormOpen] = useState<boolean>(false);
  const [Profile, setProfile] = useState<null | ProfileDataInterface>(null);
  const [Processing, setProcessing] = useState<boolean>(false);

  const fetch =  useCallback(async ()=>{
    try{
      const {data} = await api.get(`/profile`);
      setProfile(data.profile);
    }
    catch(err:unknown){
      toast.error(err.response.data.error || err.message || "Fetch employee failed!")
    }
    finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    fetch();
  },[])

  async function updateProfile(e:React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    try{
      setProcessing(true);
      const formData = new FormData(e.currentTarget);
      const {data} = await api.patch("/profile",formData , {
        headers: {
          'Content-Type': 'application/json'
        }});

        if(data.success) toast.success("Bio updated successfully!")
      }
      catch(err){
         toast.error(err.response.data.error || err.message || "Fetch employee failed!")
      }
      finally{
        setProcessing(false);
      }
  }

  async function updatePasswordHandler(e:React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    try{
      setProcessing(true);
      const formData = new FormData(e.currentTarget);
      const {data} = await api.patch("/auth/change-password", formData, {
        headers: {
          'Content-Type': 'application/json'
        }})

      if(data.success) {
        setFormOpen(false)
        toast.success("Update password successfully!");
      }
    }
    catch(err){
      toast.error(err.response.data.error || err.message || "Fetch employee failed!");
    }
    finally{
      setProcessing(false)
    }
  }


  if(Loading) return <div className='w-full h-full'><Loader></Loader></div>

  if(!Profile) return <div className='w-full h-full flex items-center justify-center text-slate-500'>Profile data not found.</div>
  return (
    <div>
        <div className='page-header'>
          <h1 className='page-title'>Settings</h1>
          <p className='page-subtitle'>Manage your account and preferences</p>
        </div>

        <div className='card p-4 lg:p-6'>
            <div>
                <div className='flex items-center gap-2 border-b border-slate-100 pb-4 mb-6'>
                    <User className='size-5 text-slate-400'></User> <h3 className='font-medium' >Public Profile</h3>
                </div>

                <form onSubmit={updateProfile}  className=' text-sm font-medium text-slate-700 space-y-4'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        <div>
                          <label className='mb-2 block' htmlFor="name">Name</label>
                          <input type="text" id="name" disabled className='cursor-not-allowed text-slate-400 font-normal' defaultValue={`${Profile?.firstName} ${Profile?.lastName}`}/>
                        </div>

                        <div>
                          <label className='mb-2 block' htmlFor="email">Email</label>
                          <input type="email" id="email" disabled className='cursor-not-allowed text-slate-400 font-normal' defaultValue={Profile?.email} />
                        </div>
                    </div>

                    <div>
                      <label className='mb-2 block' htmlFor="position">Position</label>
                      <input type="email" id="position" disabled className='cursor-not-allowed text-slate-400 font-normal' defaultValue={Profile?.position || ""} />
                    </div>  

                    <div className='pt-1'>
                      <label className='mb-2 block' htmlFor="bio">Bio</label>
                      <textarea name="bio" id="bio" placeholder='Write a brief bio...' defaultValue={Profile?.bio || ""} className='resize-none placeholder:font-normal' />
                      <p className='text-xs text-slate-400 font-normal mt-2' >This will be displayed on your profile.</p>
                    </div>

                    <div className='pt-3 flex justify-end'>
                      <button type="submit" disabled={Processing} className='flex items-center w-full md:w-fit justify-center gap-2 btn btn-primary cursor-pointer'>{Processing ? <Loader2Icon className='size-4 animate-spin' ></Loader2Icon> : <Save className='size-4'></Save>} Save Changes</button>
                    </div>
                </form>
            </div>
        </div>

        <div className='mt-6 p-6  justify-between inline-flex card items-center md:gap-16 '>
          <div className='flex gap-3 items-center'>
            <div>
                <Lock className='size-10 rounded-lg p-2.5 bg-slate-100'></Lock>
            </div>
            <div>
                <h4 className='font-medium'>Password</h4>
                <p className='text-sm text-slate-500'>Update your account password</p>
            </div>
          </div>

          <div>
            <button className='btn btn-secondary cursor-pointer' onClick={()=>setFormOpen(true)}>Change</button>
          </div>
        </div>

        {/* Modal */}
        {FormOpen &&  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setFormOpen(false)}>

            <div className='absolute inset-0 bg-black/40 backdrop-blur-sm'></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in p-5" onClick={(e)=>e.stopPropagation()}>
                 <div className="flex items-center justify-between pt-1">
                    <div className='flex gap-2 items-center'>
                      <Lock></Lock>
                        <h3 className="font-medium text-lg ">Change Password</h3>
                    </div>
                    <div>
                        <X className="size-8 duration-100 transition-colors rounded-md cursor-pointer text-slate-400 hover:bg-slate-100 p-1.5 hover:text-slate-600" onClick={()=>setFormOpen(false)}></X>
                    </div>
                </div>

                <form onSubmit={updatePasswordHandler} className='space-y-5 text-sm font-medium text-slate-700 mt-6'>
                    <div>
                      <label  className='mb-2 block' htmlFor="Current Password">Current Password</label>
                        <input type="text" name="currentPassword" id="Current Password" />
                    </div>

                    <div>
                      <label  className='mb-2 block' htmlFor="New Password">New Password</label>
                        <input type="text" name="newPassword" id="New Password" />
                    </div>

                    <div className='grid grid-cols-2 gap-3 pt-2'>
                        <button className='btn btn-secondary cursor-pointer' onClick={()=>setFormOpen(false)}>Cancel</button>
                        <button className='btn btn-primary text-center flex items-center justify-center cursor-pointer' disabled={Processing} type="submit">{Processing ? <span ><Loader2Icon className="animate-spin size-4 inline"></Loader2Icon> Updating...</span> :"Upadte Password"}</button>
                    </div>
                </form>
            </div>
               
        </div>}
    </div>
  )
}

export default Settings;
