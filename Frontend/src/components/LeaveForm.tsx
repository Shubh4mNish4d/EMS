import { CalendarDays, FileTextIcon, Loader2Icon, X } from "lucide-react"
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { getErrorMessage } from "../utils/error";


const LeaveForm = ({setFormOpen, fetchLeaves} : { setFormOpen : React.Dispatch<React.SetStateAction<boolean>> ; fetchLeaves:()=>void}) => {
  
  const [Processing, setProcessing] = useState<boolean>(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function submitHandler(e:React.SubmitEvent<HTMLFormElement>){
      e.preventDefault();
      try{
        setProcessing(true);
        const formData = new FormData(e.currentTarget);
        await api.post("/leave",formData,{
            headers: {
                'Content-Type': 'application/json'
                }
        });
        setFormOpen(false)
        fetchLeaves()
        toast.success("Leave application created!");
      }
      catch(err){
        toast.error(getErrorMessage(err, "Create payslip failed"))
      }
      finally{
        setProcessing(false)
      }
   }

  const today = new Date();
  const tomorrow =  new Date(today);
  tomorrow.setDate(today.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0];


  return (
    <div className=" w-full items-center h-full backdrop-blur-sm bg-black/40 fixed z-100 top-0 left-0 flex justify-center p-4 md:p-16" onClick={()=>setFormOpen(false)}>
        <div className="max-w-lg w-full h-fit bg-white rounded-2xl p-6" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg mb-1">Apply for Leave</h3>
                    <p className="text-sm text-slate-400 font-medium">Submit your leave request for approval</p>
                </div>
                <div>
                    <X className="size-8 duration-100 transition-colors rounded-md cursor-pointer text-slate-400 hover:bg-slate-100 p-1.5 hover:text-slate-600" onClick={()=>setFormOpen(false)}></X>
                </div>
            </div>
            <form  onSubmit={submitHandler} className="mt-6 text-sm font-medium text-slate-700 space-y-6">
              <div>
                <label htmlFor="leave-type" className="mb-2 flex gap-2 items-center"><FileTextIcon className=" size-4 text-slate-400 "></FileTextIcon> Leave Type</label>
                <select required name="type" className="cursor-pointer" id="leave-type">
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                </select>
              </div>

              <div>
                  <label htmlFor="duration" className="mb-2 flex gap-2 items-center"><CalendarDays className=" size-4 text-slate-400 "></CalendarDays>Duration</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div>
                      <span className=" text-slate-400 text-xs mb-1 block">From</span>
                      <input
                        required
                        type="date"
                        className="cursor-pointer"
                        name="startDate"
                        min={minDate}
                        value={startDate}
                        id="start-date"
                        onChange={(e) => {
                          const nextStartDate = e.target.value;
                          setStartDate(nextStartDate);
                          if (endDate && endDate < nextStartDate) setEndDate("");
                        }}
                      />
                    </div>

                    <div>
                      <span className=" text-slate-400 text-xs mb-1 block">To</span>
                      <input
                        required
                        type="date"
                        className="cursor-pointer"
                        name="endDate"
                        min={startDate || minDate}
                        value={endDate}
                        id="end-date"
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
              </div>

              <div>
                <label htmlFor="leave-type" className="mb-2 block">Reason</label>
                <textarea required name="reason" id="" className="resize-none h-20" placeholder="Breifly describe why you need this leave..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="btn cursor-pointer btn-secondary" onClick={()=>setFormOpen(false)}>Cancel</button>
                <button className="btn cursor-pointer btn-primary" disabled={Processing}>{Processing ? <span ><Loader2Icon className="animate-spin size-4 inline"></Loader2Icon> Submiting...</span> :"Submit"}</button>
              </div>

            </form>
        </div>
    </div>
  )
}

export default LeaveForm
