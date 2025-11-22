import React from 'react'
import logo from '../assets/hrms-logo.jpg'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
     localStorage.removeItem('token')
     navigate('/login')
  }
  return (
    <div className='w-full bg-white border-b-2 border-b-gray-200 py-2 px-10 flex items-center justify-between'>
       <img src={logo} alt='logo' className='w-[120px] h-[30px]' />
       <ul className='flex list-none items-center gap-4'>
        <li onClick={() => navigate('/logs')} className='text-[15px] font-semibold cursor-pointer'>Logs</li>
        <li onClick={() => navigate('/employee')} className='text-[15px] font-medium cursor-pointer'>Employees</li>
        <li onClick={() => navigate('/teams')} className='text-[15px] font-medium cursor-pointer'>Teams</li>
         <li onClick={handleLogout} className='text-[14px] font-medium text-white py-0.5 px-2 cursor-pointer rounded bg-blue-600 border-0 outline-0'>Logout</li>
       </ul>
    </div>
  )
}

export default Header
