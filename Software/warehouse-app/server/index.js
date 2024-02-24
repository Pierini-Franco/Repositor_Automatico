const http = require('http')
const url = require('url')
const uuidv4 = require("uuid").v4
const { WebSocketServer } = require('ws')

const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const PORT = 8000
// dictionarios de usuarios (username y state) y conexiones
const users = { }
const connections = { }

// evento conexion a ws server
wsServer.on("connection", (connection, request) =>{
  // recuperar username de la url
  const { username } = url.parse(request.url, true).query
  const uuid = uuidv4()

  console.log(username)
  console.log(uuid)
  // guardar objeto connection para cada usuario
  connections[uuid] = connection
  // guardar username
  users[uuid] = {
    username: username,
    products: { }
  }
})

server.listen(PORT, () =>{
  console.log(`WebSocket server running on port ${PORT}`)
})