import { useContext } from "react"

import { Navigate, useNavigate } from "react-router-dom"
import AppContext from "../context/AppContext"

export default function ProtectedRoute({element}){
    const {token} = useContext(AppContext) || localStorage.getItem('token')
    
   if(!token){
     return <Navigate to='/login' replace />
   }
   return element
}