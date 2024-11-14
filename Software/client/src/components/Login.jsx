import { useState } from "react"
import './Login.css'

export function Login({ updateUsername }) {
  const [username, setUsername] = useState("")

  return (
    <section className="loginCard">
      <strong className="titleLogin">Login</strong>
      <span className="instructionLogin">Ingresar nombre de usuario: </span>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateUsername(username)
        }}
      >
        <input
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="submit" value="Ingresar" />
      </form>
    </section>
  )
}
