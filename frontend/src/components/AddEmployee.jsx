import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import { RxCross2 } from "react-icons/rx";
import axios from 'axios'


const AddEmployee  = ({ setOpenAddEmployee}) => {

    const [employee, setEmployee] = useState({
        first_name: "", last_name: "", email: "", phone: ""
    })
    const [errMsg, setErrMsg] = useState(null)

    const { url, token} = useContext(AppContext)

    const handleUpdateUser = (e) => {
        const { value, name } = e.target
        setEmployee(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
       e.preventDefault()
       try {
          const response = await axios.post(`${url}employees`,employee, {
             headers: {
                Authorization: `Bearer ${token}`
             }
          })
          if(response.status === 200 || response.status === 201){
            errMsg('Created Successfully')
            setTimeout(() => {
                setOpenAddEmployee(false)
            }, 2000);
          } else {
            errMsg(response.data.message)
          }
       } catch (error) {
          setErrMsg('Something went wrong! Try again later')
       }
    }

    return (
        <div className='fixed flex z-1 justify-center items-center bg-[rgba(0,0,0,0.5)] h-screen w-full'>
            <div className='bg-white rounded max-w-[360px] py-8 px-3'>
                <div className='flex justify-between items-center'>
                <h2 className='text-lg font-medium'>Add Employee</h2>
                <RxCross2 onClick={() =>{ setOpenAddEmployee(false)}} className='w-4 h-4 cursor-pointer' />
                </div> 
                <form onSubmit={handleSubmit} className='flex mt-3 flex-col gap-2'>
                    <div className='grid grid-cols-2 gap-8'>
                        <div>
                            <label htmlFor='first-name' className='text-[10px] font-bold' >FIRST NAME</label>
                            <input id="first-name" value={employee.first_name} name="first_name" type="text" onChange={handleUpdateUser} placeholder='Enter your first name' className='w-full py-0.5 px-1.5 text-[13px] bg-transparent border-2 border-gray-200 outline-0' />
                        </div>
                        <div>
                            <label htmlFor='last-name'  className='text-[10px] font-bold' >LAST NAME</label>
                            <input id="last-name" value={employee.last_name} name="last_name" type="text" onChange={handleUpdateUser} placeholder='Enter your last name' className='w-full py-0.5 px-1.5 text-[13px] bg-transparent border-2 border-gray-200 outline-0' />
                        </div>
                    </div>
                    <div>
                        <label htmlFor='email'  className='text-[10px] font-bold' >EMAIL</label>
                        <input id="email" name="email" value={employee.email} type="email" onChange={handleUpdateUser} placeholder='Enter your email address' className='w-full py-0.5 px-1.5 text-[13px] bg-transparent border-2 border-gray-200 outline-0' />
                    </div>
                    <div>
                        <label htmlFor='phone'  className='text-[10px] font-bold' >PHONE</label>
                        <input id="phone" name="phone" value={employee.phone} type="text" onChange={handleUpdateUser} placeholder='Enter your phone number' className='w-full py-0.5 px-1.5 text-[13px] bg-transparent border-2 border-gray-200 outline-0' />
                    </div>
                    <div className='grid grid-cols-2 gap-10'>
                        <button type="submit" className='w-full cursor-pointer py-1 px-2 flex justify-center text-[13px] rounded items-center bg-blue-500 text-white font-medium'>
                            Create
                        </button>
                        <button onClick={() =>{ setOpenAddEmployee(false)}} className='w-full py-1 px-2 cursor-pointer flex justify-center items-center text-[13px] rounded bg-gray-300 text-gray-700 font-medium'>
                            Cancel
                        </button>
                    </div>
                </form>
                {errMsg && <p className='text-center text-[14px] font-semibold'>{errMsg}</p>}
            </div>
        </div>
    )
}

export default AddEmployee
