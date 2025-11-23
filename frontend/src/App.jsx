import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import AppContext from './context/AppContext'
import Dashboard from './pages/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Employee from './pages/Employee'
import Logs from './pages/Logs'
import Teams from './pages/Teams'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [token, setToken] = useState(null)
  
  useEffect(() => {
  const token = localStorage.getItem('token')
  if(!token) return 
  setToken(token)
}, [])


  // const url = 'http://localhost:5000/api/'
  const url = 'https://human-resource-management-system-c8rg.onrender.com/api/'

  return (
    <AppContext.Provider value={{
      url: url, token: token, setToken: setToken 
    }}>
      <Routes>
        <Route path='/' element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path='/login' element={<LoginPage /> }  />
        <Route path='/employee' element={<ProtectedRoute element={<Employee />} />} />
        <Route path='/logs' element={<ProtectedRoute element={<Logs />}/>}   />
        <Route path='/teams' element={<ProtectedRoute element={<Teams />} />}  />
      </Routes>
    </AppContext.Provider>
  )
}

export default App
