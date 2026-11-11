import { Loader2Icon, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import api from '../api/axios';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/error';

const AttendanceBtn = ({todayRecord,fetchAttendanceData}:any) => {
    const [loading, setloading] = useState(false);

    async function HandleAttandanceBtn(){
        setloading(true);
        try{
           const {data} = await api.post("/attendance");
           console.log(data)
           fetchAttendanceData();
        }
        catch(err){
            toast.error(getErrorMessage(err, "Fetch attendance failed!"));
        }
        finally{
            setloading(false)
        }
        
    }

  return (
    <div>
        <button className={`fixed bottom-4 right-4  p-4 flex items-center justify-between gap-8 rounded-xl bg-linear-to-br text-white  cursor-pointer form-bg-slate-700 to-bg-slate-900 hover:scale-102 active:scale-100 duration-150 ${todayRecord?.checkIn && !todayRecord.checkOut ? "from-slate-700 to-slate-900" : "from-indigo-600 to-indigo-700"}`}

        onClick={HandleAttandanceBtn} disabled={loading}>
            <div>
               {loading ?  <Loader2Icon className='size-7 animate-spin'/> : todayRecord?.checkIn && !todayRecord.checkOut ?  <LogOut size={28}/> : <LogIn size={28}/> }
            </div>
            <div className='text-center'>
                <h5 className='text-lg font-medium pb-1'> {loading ? " Loading..." : todayRecord?.checkIn &&  !todayRecord.checkOut ?  "Check Out" : "Check In" }</h5>
                <p className='text-xs text-white/80'>{todayRecord?.checkIn  && !todayRecord.checkOut ?  "Click to end your shift" : "Start your work day "}</p>
            </div>
        </button>
    
    </div>
  )
}

export default AttendanceBtn
