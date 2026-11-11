import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
       <Loader2 className="animate-spin text-indigo-500 size-10" />
    </div>
  )
}

export default Loader;
