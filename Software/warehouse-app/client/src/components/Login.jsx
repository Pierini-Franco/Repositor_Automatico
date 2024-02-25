import { useState } from "react"

export function Login({ updateUsername }){
  const [username, setUsername] = useState("")
  return(
    <>
      <h1>Login</h1>
      <p>Ingresar nombre de usuario: </p>
      <form onSubmit={(e) =>{
        e.preventDefault()
        updateUsername(username)
      }}>
        <input 
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) =>{setUsername(e.target.value)}}
        />
        <input type="submit" />
      </form>
    </>
  )
}