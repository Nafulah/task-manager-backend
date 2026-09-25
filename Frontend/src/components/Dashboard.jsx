import { useState, useEffect } from 'react'

export default function Dashboard({ onLogout }){
  const [tasks,setTasks]=useState([])
  const [title,setTitle]=useState("")
  const [editingId,setEditingId]=useState(null)
  const [editTitle,setEditTitle]=useState("")

  useEffect(()=>{
    const getTasks = async()=>{
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/tasks",{ headers: { "x-auth-token": token } })
      const data = await res.json()
      if(Array.isArray(data)) setTasks(data)
    }
    getTasks()
  },[])

  const addTask = async(e)=>{
    e.preventDefault()
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:5000/api/tasks",{
      method:"POST",
      headers: { "Content-Type":"application/json", "x-auth-token": token },
      body: JSON.stringify({title})
    })
    const newTask = await res.json()
    setTasks([...tasks, newTask])
    setTitle("")
  }

  const deleteTask = async(id)=>{
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:5000/api/tasks/${id}`,{ method:"DELETE", headers: { "x-auth-token": token } })
    setTasks(tasks.filter(t=> t._id !== id))
  }

  const startEdit = (task)=>{
    setEditingId(task._id)
    setEditTitle(task.title)
  }

  const saveEdit = async(id)=>{
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`,{
      method:"PUT",
      headers: { "Content-Type":"application/json", "x-auth-token": token },
      body: JSON.stringify({title: editTitle})
    })
    const updated = await res.json()
    setTasks(tasks.map(t=> t._id === id ? updated : t))
    setEditingId(null)
  }

  return(
    <div style={{background:"#16423C", padding:"25px", borderRadius:"16px", color:"white", boxShadow:"0 10px 25px rgba(0,0,0,0.3)"}}>
      
      {/* FIXED TITLE - No more overlap */}
      <div style={{textAlign:"center", marginBottom:"10px"}}>
        <h1 style={{color:"#C4DFE6", margin:"0", fontSize:"32px", lineHeight:"1.2", letterSpacing:"0.5px"}}>🌿 Jungle Task Manager</h1>
        <p style={{color:"#E8FFCE", opacity:0.8, marginTop:"8px"}}>Each task shows date & time you created it</p>
      </div>

      <div style={{background:"rgba(255,255,255,0.08)", padding:"15px", borderRadius:"12px", margin:"20px 0", display:"flex", gap:"10px"}}>
        <input placeholder="Add new task..." value={title} onChange={e=>setTitle(e.target.value)} required 
          style={{flex:1, padding:"12px", borderRadius:"8px", border:"none", outline:"none", fontSize:"14px"}} />
        <button onClick={addTask} style={{padding:"12px 20px", background:"#C4DFE6", color:"#16423C", border:"none", borderRadius:"8px", fontWeight:"bold", cursor:"pointer"}}>Add</button>
      </div>

      <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
        {tasks.map(task=>(
          <div key={task._id} style={{background:"#EAF6F6", color:"#16423C", padding:"14px 16px", borderRadius:"10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            {editingId === task._id ? (
              <div style={{display:"flex", gap:"8px", width:"100%"}}>
                <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={{flex:1, padding:"8px", borderRadius:"6px", border:"1px solid #6A9C89"}} />
                <button onClick={()=>saveEdit(task._id)} style={btnGreen}>Save</button>
                <button onClick={()=>setEditingId(null)} style={btnGray}>Cancel</button>
              </div>
            ) : (
              <>
                <div>
                  <div style={{fontWeight:"600", fontSize:"15px"}}>{task.title}</div>
                  <div style={{fontSize:"12px", color:"#6A9C89", marginTop:"4px"}}>🗓️ {new Date(task.createdAt).toLocaleString()}</div>
                </div>
                <div style={{display:"flex", gap:"6px"}}>
                  <button onClick={()=>startEdit(task)} style={btnGreen}>Edit</button>
                  <button onClick={()=>deleteTask(task._id)} style={btnRed}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && <p style={{textAlign:"center", color:"#C4DFE6", marginTop:"20px", opacity:0.7}}>No tasks yet - add one above!</p>}

      <div style={{textAlign:"center", marginTop:"25px"}}>
        <button onClick={()=>{localStorage.removeItem("token"); onLogout()}} style={{padding:"10px 22px", background:"#0F2C26", color:"#C4DFE6", border:"1px solid #6A9C89", borderRadius:"8px", cursor:"pointer"}}>Logout</button>
      </div>
    </div>
  )
}
const btnGreen = {background:"#6A9C89", color:"white", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontSize:"12px"}
const btnRed = {background:"#C25B56", color:"white", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontSize:"12px"}
const btnGray = {background:"#888", color:"white", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontSize:"12px"}