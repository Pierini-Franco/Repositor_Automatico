import { useState } from "react"

export function Login({ updateUsername }){
  const [username, setUsername] = useState("")
  console.log(username)
  return(
    <>
      <h1>Login</h1>
      <p>Ingresar nombre de usuario: </p>
      <form >
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