const http = require('http')
const { WebSocketServer } = require('ws')

const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const PORT = 8000

server.listen(PORT, () =>{
  console.log(`WebSocket server running on port ${PORT}`)
})