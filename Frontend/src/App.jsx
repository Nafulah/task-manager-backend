import { useState } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App(){
  // Check token directly here - no useEffect needed! (Fixes the error)
  const [isLoggedIn, setIsLoggedIn] = useState(()=>{
    const token = localStorage.getItem("token")
    return !!token // true if token exists, false if not
  })

  return (
    <div style={{padding:"20px", fontFamily:"Arial", maxWidth:"600px", margin:"auto", background:"#E8FFCE", minHeight:"100vh", borderRadius:"12px"}}>
      {isLoggedIn ? (
        <Dashboard onLogout={()=>setIsLoggedIn(false)} />
      ) : (
        <>
          <h1 style={{textAlign:"center"}}>Task Manager MVP</h1>
          <p style={{textAlign:"center"}}>Welcome to my Task List</p>
          <Register />
          <hr style={{margin:"20px 0"}} />
          <Login onLogin={()=>setIsLoggedIn(true)} />
        </>
      )}
    </div>
  )
}
export default App