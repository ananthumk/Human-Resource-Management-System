import React, { useContext, useState } from 'react'
import image from '../assets/hrms.jpg'
import logo from '../assets/hrms-logo.jpg'
import AppContext from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { MdEmail, MdLock, MdBusiness, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md'

const LoginPage = () => {
  const [isLogin, setLogin] = useState(true)
  const [errMsg, setErrMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userInfo, setUserInfo] = useState({
    orgName: "", adminName: "", email: "", password: ""
  })
  const { url, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  
  const switchTxt = !isLogin ? 'Already have an account' : `Don't have an account`
  const btnTxt = isLogin ? 'Login' : 'Register'
  const titleTxt = isLogin ? 'Welcome Back!' : 'Create Account'
  const subtitleTxt = isLogin ? 'Login to access your HRMS dashboard' : 'Register your organization to get started'

  const toggleSwitch = () => {
    setLogin(prev => !prev)
    setErrMsg(null)
    setUserInfo({
      orgName: "", adminName: "", email: "", password: ""
    })
  }

  const handleChanges = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }))
    setErrMsg(null) // Clear error when user starts typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrMsg(null)

    try {
      const response = await axios.post(`${url}auth/${isLogin ? 'login' : 'register'}`, userInfo)
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('token', response.data.token)
        setToken(response.data.token)
        setUserInfo({ orgName: "", adminName: "", email: "", password: "" })
        navigate('/')
      } else {
        setToken(null)
        setErrMsg(response.data.message || 'Authentication failed')
      }
    } catch (error) {
      setErrMsg(error.response?.data?.message || 'Something went wrong! Please try again')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4'>
      <div className='w-full max-w-6xl flex items-center justify-center gap-5'>
        
        {/* Left Side - Image (Hidden on mobile) */}
        <div className='hidden md:flex flex-col items-center justify-center flex-1 p-8'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl transform rotate-3 opacity-20'></div>
            <img 
              src={image} 
              alt="HRMS Dashboard" 
              className='relative w-full max-w-[500px] h-auto rounded-3xl shadow-2xl object-cover'
            />
          </div>
          <div className='mt-8 text-center'>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>
              Human Resource Management
            </h2>
            <p className='text-gray-600 max-w-md'>
              Streamline your workforce management with our comprehensive HRMS solution
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='w-full md:w-auto md:flex-1 max-w-md'>
          <div className='bg-white rounded-2xl shadow-2xl p-6 md:p-10'>
            
            {/* Logo and Header */}
            <div className='text-center mb-3'>
              <img 
                src={logo} 
                alt="HRMS Logo" 
                className='w-32 h-auto mx-auto mb-4'
              />
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {titleTxt}
              </h1>
              <p className='text-gray-600 text-sm'>
                {subtitleTxt}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-2'>
              
              {/* Organization Name (Register only) */}
              {!isLogin && (
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-gray-700 uppercase tracking-wide'>
                    Organization Name
                  </label>
                  <div className='relative'>
                    <MdBusiness className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input 
                      type="text" 
                      name="orgName" 
                      value={userInfo.orgName} 
                      onChange={handleChanges}
                      placeholder='Enter organization name' 
                      className='w-full pl-10 pr-4 py-3 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Admin Name (Register only) */}
              {!isLogin && (
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-gray-700 uppercase tracking-wide'>
                    Admin Name
                  </label>
                  <div className='relative'>
                    <MdPerson className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input 
                      type="text" 
                      name="adminName" 
                      value={userInfo.adminName} 
                      onChange={handleChanges}
                      placeholder='Enter admin name' 
                      className='w-full pl-10 pr-4 py-3 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase tracking-wide'>
                  Email Address
                </label>
                <div className='relative'>
                  <MdEmail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input 
                    type="email" 
                    name="email" 
                    value={userInfo.email} 
                    onChange={handleChanges}
                    placeholder='Enter your email' 
                    className='w-full pl-10 pr-4 py-3 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase tracking-wide'>
                  Password
                </label>
                <div className='relative'>
                  <MdLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    value={userInfo.password} 
                    onChange={handleChanges}
                    placeholder='Enter your password' 
                    className='w-full pl-10 pr-12 py-3 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    {showPassword ? (
                      <MdVisibilityOff className='w-5 h-5' />
                    ) : (
                      <MdVisibility className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errMsg && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                  <p className='font-medium'>{errMsg}</p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 text-white py-3 px-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : btnTxt}
              </button>

              {/* Toggle Login/Register */}
              <div className='text-center '>
                <p className='text-sm text-gray-600'>
                  {switchTxt}?{' '}
                  <button
                    type="button"
                    onClick={toggleSwitch}
                    className='text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors'
                  >
                    Click here
                  </button>
                </p>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage