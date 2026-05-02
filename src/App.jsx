import { useState, useEffect } from "react"

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzczE4NjlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDI2NSwiaWF0IjoxNzc3NzAzMzY1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNDQ3MmUxMDktNDQ5Ny00ZmRhLThkNzktOTk2YzVlYjllNWYwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic291bXlhIHNpbmdoIiwic3ViIjoiMDY5NDc0MjYtM2NlZS00N2IwLTgyMmUtZTg0NjdkMDVkZjljIn0sImVtYWlsIjoic3MxODY5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoic291bXlhIHNpbmdoIiwicm9sbE5vIjoicmEyMzExMDMwMDIwMTM5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMDY5NDc0MjYtM2NlZS00N2IwLTgyMmUtZTg0NjdkMDVkZjljIiwiY2xpZW50U2VjcmV0IjoiR1pOWFlIWWJaVHRRZlN0VSJ9.6iqXfvv5dfeCKy9STiurzr9VHG0wL-MYFoukhw2Gelg"

const log = (action, payload) => {
  const entry = {
    time: new Date().toISOString(),
    action,
    payload
  }

  console.log("LOG:", entry)

  const logs = JSON.parse(localStorage.getItem("logs") || "[]")
  logs.push(entry)
  localStorage.setItem("logs", JSON.stringify(logs))
}

function App() {
  const [list, setList] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/notifications", {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    })
      .then(res => res.json())
      .then(data => {
        log("FETCH_NOTIFICATIONS", data)
        setList(data)
      })
  }, [])

  const add = () => {
    const item = {
      title: "New Alert",
      body: "Generated notification",
      time: "now",
      seen: false
    }

    fetch("http://localhost:5000/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify(item)
    })
      .then(res => res.json())
      .then(newItem => {
        log("ADD_NOTIFICATION", newItem)
        setList(prev => [newItem, ...prev])
      })
  }

  const remove = (id) => {
    fetch(`http://localhost:5000/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }).then(() => {
      log("REMOVE_NOTIFICATION", { id })
      setList(prev => prev.filter(n => n.id !== id))
    })
  }

  const markAll = () => {
    log("MARK_ALL_READ", {})
    setList(prev => prev.map(n => ({ ...n, seen: true })))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <div className="flex gap-4 text-sm">
            <button onClick={add} className="text-neutral-400 hover:text-white transition">Add</button>
            <button onClick={markAll} className="text-neutral-400 hover:text-white transition">Clear</button>
          </div>
        </div>

        <div className="space-y-4">
          {list.map(item => (
            <div
              key={item.id}
              className={`group rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.02] ${
                item.seen
                  ? "bg-neutral-950 border-neutral-900 opacity-70"
                  : "bg-neutral-900/80 border-neutral-800 shadow-lg"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-neutral-400">{item.body}</p>
                </div>

                <button onClick={() => remove(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default App