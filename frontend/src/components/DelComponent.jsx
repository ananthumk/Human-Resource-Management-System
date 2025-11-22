import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'

const DelComponent = ({employee, setOpenDelEmployee }) => {
    const [msg, setMsg] = useState(null)
    const {url, token} = useContext(AppContext)
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${url}employees/${employee.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 200 || response.status === 201){
                setMsg('Employee Deleted')
                setTimeout(() => {
                    setOpenDelEmployee(false)
                }, 2000);
            } else {
                setMsg(response.data.message)
            }
        } catch (error) {
            setMsg('Something went wrong! try again later')
        }
    }
  return (
    <div className='fixed flex z-1 justify-center items-center bg-[rgba(0,0,0,0.5)] h-screen w-full'>
       <div className='bg-white px-5 py-3 rounded-md '>
            <p className='text-center text-[14px] mb-3'>Are you sure?</p>
            <div className='flex items-center justify-center gap-5'>
                <button onClick={handleDelete} className='rounded-sm cursor-pointer bg-red-500 border-0 text-[16px] text-white py-1 px-5 flex justify-center items-center'>
                    Continue
                </button>
                <button onClick={() => {setOpenDelEmployee(false)}} className='rounded-sm cursor-pointer bg-gray-200 px-5 border-0 text-[16px] text-gray-700 py-1 flex justify-center items-center'>
                    Cancel
                </button>
            </div>
            {msg && <p className='text-center text-[14px]'>{msg}</p>}
       </div>
    </div>
  )
}

export default DelComponent
