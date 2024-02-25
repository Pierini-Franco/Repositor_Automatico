import { useState } from "react"
import { Home } from "./Home.jsx"
import { Login } from "./components/Login.jsx"

export function App(){
  const [username, setUsername] = useState("")
  return username ? (
    <Home />
  ) : (
    <Login updateUsername={setUsername}/>
  )
}