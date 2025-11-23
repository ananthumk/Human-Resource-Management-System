import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import axios from 'axios'
import { MdClose } from 'react-icons/md'

const CreateTeam = ({ setAddForm, onTeamCreated }) => {
  const [teamInfo, setTeamInfo] = useState({
    name: "", 
    description: ""
  })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const { url, token } = useContext(AppContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setTeamInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!teamInfo.name.trim()) {
      setMsg('Team name is required')
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      const response = await axios.post(`${url}teams`, teamInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200 || response.status === 201) {
        setMsg('Team created successfully!')
        
        // Call the callback to refresh the teams list
        if (onTeamCreated) {
          await onTeamCreated()
        }

        // Close modal after short delay
        setTimeout(() => {
          setAddForm(false)
        }, 1500)
      } else {
        setMsg(response.data?.error || 'Failed to create team')
      }
    } catch (error) {
      console.error('Error creating team:', error)
      setMsg(error.response?.data?.error || error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAddForm(false)
  }

  return (
    <div className='fixed flex z-50 justify-center items-center bg-[rgba(0,0,0,0.5)] h-screen w-full top-0 left-0'>
      <div className='bg-white min-w-[300px] max-w-[450px] w-full mx-4 shadow-2xl rounded-lg overflow-hidden'>
        {/* Header */}
        <div className='bg-blue-600 text-white py-4 px-5 flex justify-between items-center'>
          <h2 className='text-lg font-bold'>Create New Team</h2>
          <button 
            onClick={handleClose}
            className='hover:bg-blue-700 rounded-full p-1 cursor-pointer transition-colors'
            type='button'
          >
            <MdClose className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-6'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='name' className='text-xs font-bold text-gray-700 uppercase tracking-wide'>
              Team Name *
            </label>
            <input 
              type="text" 
              id="name" 
              onChange={handleChange} 
              value={teamInfo.name} 
              name="name" 
              placeholder='Enter team name' 
              className='w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='description' className='text-xs font-bold text-gray-700 uppercase tracking-wide'>
              Team Description
            </label>
            <textarea 
              id="description" 
              onChange={handleChange} 
              value={teamInfo.description} 
              name="description" 
              placeholder='Enter team description (optional)' 
              className='w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none'
              rows={4}
            />
          </div>

          {/* Message Display */}
          {msg && (
            <div className={`text-sm text-center font-medium py-2 px-3 rounded-md ${
              msg.includes('success') 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {msg}
            </div>
          )}

          {/* Buttons */}
          <div className='grid grid-cols-2 gap-4 mt-2'>
            <button 
              type="submit" 
              disabled={loading}
              className='bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-4 rounded-md font-semibold transition-colors duration-200 flex items-center justify-center'
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </button>
            <button 
              type='button'
              onClick={handleClose} 
              disabled={loading}
              className='bg-gray-200 cursor-pointer hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 py-2.5 px-4 rounded-md font-semibold transition-colors duration-200'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTeam