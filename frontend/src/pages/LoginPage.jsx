import React, { useContext, useState } from 'react'
import image from '../assets/hrms.jpg'
import logo from '../assets/hrms-logo.jpg'
import AppContext from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {

  const [isLogin, setLogin] = useState(true)
  const [errMsg, setErrMsg] = useState(null)
  const [userInfo, setUserInfo] = useState({
    orgName: "", adminName: "", email: "", password: ""
  })
  const {url, setToken} = useContext(AppContext)

  const navigate = useNavigate()
  
  const switchTxt = !isLogin ? 'Already have a account' : `Don't have a account`
  const btnTxt = isLogin ? 'Login' : 'Register'
 
  console.log(userInfo)
  const toggleSwitch = () => {
    setLogin(prev => !prev)
    setErrMsg(null)
    setUserInfo({
        orgName: "", adminName: "", email: "", password: ""
    })
  }

  const handleChanges = (e) => {
    const {name, value} = e.target
    setUserInfo(prev => ({
        ...prev,
        [name]: value
    }))
  }

  const handleSubmit = async(e) => {
      e.preventDefault()
      try {
        const response = await axios.post(`${url}auth/${isLogin ? 'login' : 'register'}`, userInfo)
        if(response.status === 200 || response.status === 201){
          localStorage.setItem('token', response.data.token)
            setToken(response.data.token)
            console.log(response)
            setUserInfo({orgName: "", adminName: "", email: "", password: ""})
            navigate('/')
        } else {
            setToken(null)
            setErrMsg(response.data.message)
            console.log(response)
        }
      } catch (error) {
        setErrMsg('Something went wrong! Try again later')
        setToken(null)
      }
  }

  return (
    <div className='min-h-screen flex justify-evenly items-center gap-7 min-w-full bg-white'>
         <img src={image} alt="hrms" className='w-[600px] h-[400px] rounded-lg' />
         <div className='py-4 px-2 rounded-xl min-w-[300px] flex flex-col items-center gap-2 bg-white shadow-lg shadow-gray-900'>
             <img src={logo} alt="hrms-logo" className='w-[120px] h-[50px]' />
             <form onSubmit={handleSubmit} className='flex flex-col w-[85%] mx-auto gap-2'>
                 {!isLogin && <div className='flex flex-col'>
                     <label className='text-[11px] font-bold'>ORIGINATION NAME</label>
                     <input type="text" name="orgName" value={userInfo.orgName} onChange={handleChanges} placeholder='Origination Name' className='w-full py-1.5 px-2 placeholder:text-[12px] text-[14px] rounded bg-gray-100 border-0 outline-0' />
                  </div>}
                  {!isLogin && <div className='flex flex-col'>
                     <label className='text-[11px] font-bold'>ADMIN NAME</label>
                     <input type="text" name="adminName" value={userInfo.adminName} onChange={handleChanges} placeholder='Admin Name' className='w-full py-1.5 px-2 placeholder:text-[12px] text-[14px] rounded bg-gray-100 border-0 outline-0' />
                  </div>}
                  <div className='flex flex-col'>
                     <label className='text-[11px] font-bold'>EMAIL</label>
                     <input type="text" name="email" value={userInfo.email} onChange={handleChanges} placeholder='Email' className='w-full py-1.5 px-2 placeholder:text-[12px] text-[14px] rounded bg-gray-100 border-0 outline-0' />
                  </div>
                  <div className='flex flex-col'>
                     <label className='text-[11px] font-bold'>PASSWORD</label>
                     <input type="password" name="password" value={userInfo.password} onChange={handleChanges} placeholder='Password' className='w-full py-1.5 placeholder:text-[12px] px-2 text-[14px] rounded bg-gray-100 border-0 outline-0' />
                  </div>
                  <button type="submit" className='bg-blue-600 cursor-pointer py-1.5 px-3 text-white text-[17px] font-semibold rounded'>{btnTxt}</button>
                  <p className='text-[12px] font-light p-0'>{switchTxt}? <span onClick={toggleSwitch} className='hover:underline text-blue-500 cursor-pointer'>Click here</span></p>
                  {errMsg && <p className='text-[13px] font-medium text-center'>{errMsg}</p>}
             </form>
         </div>
    </div>
  )
}

export default LoginPage
