import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import AppContext from '../context/AppContext'

const Logs = () => {
  const [logsDetails, setLogsDetails] = useState([])
  const {url, token} = useContext(AppContext)
 
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${url}logs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if(response.status === 200 || response.status === 201){
          console.log(response)
          setLogsDetails(response.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchLogs()
  }, [url, token])
  return (
    <div>
       <Header />
       <div className='flex flex-col gap-4 py-5 px-12'>
         <h1 className='text-2xl font-bold'>Logs</h1>
          <table className="min-w-full bg-white rounded shadow">
                                  <thead className="bg-neutral-200 h-[38px]">
                                      <tr>
                                          <th className="px-4 py-2 text-left font-semibold text-neutral-700">TimeStamp</th>
                                          <th className="px-4 py-2 text-left font-semibold text-neutral-700">User</th>
                                          
                                          <th className="px-4 py-2 text-left font-semibold text-neutral-700">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody className="">
                                      {logsDetails.length === 0 ? (
                                          <tr>
                                              <td colSpan={5} className="text-center py-8 text-neutral-500">
                                                  No data found
                                              </td>
                                          </tr>
                                      ) : (
                                          logsDetails.map((logs) => (
                                              <tr key={logs.id} className="hover:bg-neutral-50 border-b-2 border-gray-100  transition-colors">
                                                  <td className="px-4 py-2">{logs.timestamp}</td>
                                                  <td className="px-4 py-2">{logs.meta.email}</td>
                                                  
                                                  <td className="px-4 py-2">
                                                      
                                                          {logs.action}
                                                  </td>
                                              </tr>
                                          ))
                                      )}
                                  </tbody>
                              </table>
       </div> 
    </div>
  )
}

export default Logs
