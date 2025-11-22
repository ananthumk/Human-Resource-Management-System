import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import axios from 'axios'

const CreateTeam = ({setAddForm}) => {
  const [ teamInfo, setTeamInfo] = useState({
    name: "", description: ""
  })
 
  const [msg, setMsg] = useState(null)
  const {url, token} = useContext(AppContext)

  const handleChange = (e) => {
    const {name, value} = e.target
    setTeamInfo(prev => ({...prev,
        [name]: value})
        
    )
  }

  const handleSubmit = async (e) => {
     e.preventDefault()
      try {
        const response = await axios.post(`${url}teams`, teamInfo, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(response.status === 200 || response.status === 201){
            setMsg('Team created successfully')
            setTimeout(() => {
                setAddForm(false)
            }, 2000);
        }else{
            setMsg(response.data.error)
        }
      } catch (error) {
        setMsg(error.message)
      }
  }
  return (
    <div className='fixed flex z-50 justify-center items-center bg-[rgba(0,0,0,0.5)] h-screen w-full'>
       <div className='bg-white min-w-[300px] max-w-[400px] shadow-lg py-3 px-5'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='name' className='text-[11px] font-semibold'>TEAM NAME</label>
                <input type="text" id="name" onChange={handleChange} value={teamInfo.name} name="name" placeholder='Team Name' className='w-full py-1 px-3 rounded-sm' />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor='description' className='text-[11px] font-semibold'>TEAM DESCRIPTION</label>
                <textarea type="text" id="description" onChange={handleChange} value={teamInfo.description} name="description" placeholder='Team Name' className='w-full py-1 px-3 rounded-sm' />
              </div>
              <div className='grid grid-cols-2 gap-5'>
                <button type="submit" className='bg-blue-500 text-[14px] font-medium rounded-sm text-white'>
                    Create
                </button>
                <button onClick={() => {setAddForm(false)}} className='bg-gray-200 text-[14px] font-medium rounded-sm text-gray-600'>
                    Cancel
                </button>
              </div>
              {msg && <p className='text-[13px] text-center font-medium'>{msg}</p>}
          </form>
       </div>
    </div>
  )
}

export default CreateTeam
