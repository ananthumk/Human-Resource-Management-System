import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../context/AppContext'
import { RxCross2 } from "react-icons/rx";
import axios from 'axios'

const AddEmployee = ({ setOpenAddEmployee, onAddSuccess }) => {
    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: ""
    })
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { url, token } = useContext(AppContext)

    const handleUpdateUser = (e) => {
        const { value, name } = e.target
        setEmployee(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errMsg) setErrMsg(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Basic validation
        if (!employee.first_name.trim() || !employee.last_name.trim()) {
            setErrMsg('First name and last name are required')
            return
        }

        setIsLoading(true)
        setErrMsg(null)
        setSuccessMsg(null)

        try {
            const response = await axios.post(
                `${url}employees`,
                employee,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            
            if (response.status === 200 || response.status === 201) {
                setSuccessMsg('Employee created successfully!')
                
                // Call callback if provided
                if (onAddSuccess) {
                    onAddSuccess(response.data.data)
                }
                
                // Close modal after 1.5 seconds
                setTimeout(() => {
                    setOpenAddEmployee(false)
                }, 1500)
            } else {
                setErrMsg(response.data.message || 'Creation failed')
            }
        } catch (error) {
            console.error('Create error:', error)
            setErrMsg(
                error.response?.data?.message || 
                'Something went wrong! Please try again later'
            )
        } finally {
            setIsLoading(false)
        }
    }

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpenAddEmployee(false)
        }
    }

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setOpenAddEmployee(false)
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [setOpenAddEmployee])

    return (
        <div 
            className='fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto'
            onClick={handleBackdropClick}
        >
            <div className='bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto my-8'>
                {/* Header */}
                <div className='flex justify-between items-center px-6 py-4 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold text-gray-800'>Add New Employee</h2>
                    <button
                        onClick={() => setOpenAddEmployee(false)}
                        className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'
                        aria-label='Close modal'
                    >
                        <RxCross2 className='w-5 h-5 text-gray-600' />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='px-6 py-5 space-y-4'>
                    {/* Name Fields */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='flex flex-col'>
                            <label htmlFor='first-name' className='text-xs font-semibold text-gray-700 mb-1.5'>
                                FIRST NAME <span className='text-red-500'>*</span>
                            </label>
                            <input
                                id="first-name"
                                value={employee.first_name}
                                name="first_name"
                                type="text"
                                onChange={handleUpdateUser}
                                placeholder='Enter first name'
                                required
                                className='px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='last-name' className='text-xs font-semibold text-gray-700 mb-1.5'>
                                LAST NAME <span className='text-red-500'>*</span>
                            </label>
                            <input
                                id="last-name"
                                value={employee.last_name}
                                name="last_name"
                                type="text"
                                onChange={handleUpdateUser}
                                placeholder='Enter last name'
                                required
                                className='px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200'
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className='flex flex-col'>
                        <label htmlFor='email' className='text-xs font-semibold text-gray-700 mb-1.5'>
                            EMAIL
                        </label>
                        <input
                            id="email"
                            name="email"
                            value={employee.email}
                            type="email"
                            onChange={handleUpdateUser}
                            placeholder='Enter email address'
                            className='px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200'
                        />
                    </div>

                    {/* Phone Field */}
                    <div className='flex flex-col'>
                        <label htmlFor='phone' className='text-xs font-semibold text-gray-700 mb-1.5'>
                            PHONE
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            value={employee.phone}
                            type="tel"
                            onChange={handleUpdateUser}
                            placeholder='Enter phone number'
                            className='px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200'
                        />
                    </div>

                    {/* Messages */}
                    {errMsg && (
                        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm'>
                            {errMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm'>
                            {successMsg}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className='w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm'
                        >
                            {isLoading ? (
                                <span className='flex items-center justify-center'>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                'Create Employee'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpenAddEmployee(false)}
                            disabled={isLoading}
                            className='w-full py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddEmployee