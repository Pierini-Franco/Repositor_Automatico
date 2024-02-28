const http = require('http')
const url = require('url')
const uuidv4 = require("uuid").v4
const { WebSocketServer } = require('ws')

const mqtt = require("mqtt")
const clientId = 'emqxnodejs' + Math.random().toString(16).substring(2, 8)
const username = 'Rodri'
const password = 'NodeJS'
const client = mqtt.connect('mqtt://broker.emqx.io:1883', {
  clientId,
  username,
  password,
})
const topic = 'posicion/lugar'
const qos = 0

const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const PORT = 8000
// dictionarios de usuarios (username y state) y conexiones
const users = { }
const connections = { }

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString())
  console.log(typeof(message))
  
  // printear id de uno de los productos
  console.log(message[0].id)
  const user = users[uuid]

  // aca se guarda lo q yo quiero y en el formato q quiero, para q se mande al broker  --> nombre, id y cantidad
  user.products = {
    id: message[0].id,
    prname: message[0].name,
    quantity: message[0].quantity
  }

  // aca se guarda en user el mensaje completo q viene del client --> incluye nombre, id, imagenes, categoria, stock 
  // user.products = message
  console.log(`${user.username} ordeno ${JSON.stringify(user.products)}`)
  // enviar mensaje de productos al broker
  client.publish(topic, JSON.stringify(user), { qos }, (error) =>{
    if(error){
      console.log('Cannot send message to topic')
    }
    console.log(`Message sent to broker: ${JSON.stringify(user)}`)
  })
}

const handleClose = (uuid) =>{
  console.log(`${users[uuid].username} disconnected`)
  delete users[uuid]
  delete connections[uuid]
}
// ni bien se conecta al broker, se subcribe al topico y publica mensaje
client.on("connect", () =>{
  client.subscribe(topic, { qos }, (error) =>{
    if(error){
      console.log('Cannot subcribe to topic')
    }
  })
  client.publish(topic, "Conectado", { qos }, (error) =>{
    if(error){
      console.log('Cannot send message to topic')
    }
  })
})

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
  
  connection.on("message", (message) => handleMessage(message, uuid))
  connection.on("close", () => handleClose(uuid))
})


server.listen(PORT, () =>{
  console.log(`WebSocket server running on port ${PORT}`)
})