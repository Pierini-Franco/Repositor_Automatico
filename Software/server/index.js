import http from 'http';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';
import sql from 'mssql';
import { dbConfig } from './SQL/db/config.js';
import mqtt from 'mqtt';

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const PORT = 8000;

const users = {};
const connections = {};
let lastProducts = [];

// Configuración MQTT
const protocol = 'mqtt';
const host = 'broker.emqx.io';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;

// Tópicos MQTT
const modoTopic = 'Estado';
const inicioTopic = 'Iniciacion';
const direccionTopic = 'Direccion';
const nivelTopic = 'Nivel';

// Crear y conectar el cliente MQTT
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'Kosmos',
  password: 'kosmos2024',
  reconnectPeriod: 1000
});

// Callback de conexión MQTT
client.on('connect', () => {
  console.log('Conectado al broker MQTT');
});

// Función para leer productos desde la base de datos
const fetchProductsFromDB = async () => {
  try {
    let pool = await sql.connect(dbConfig);
    const request = pool.request();
    const result = await request.query('SELECT * FROM Productos');
    return result.recordset.map(product => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      category: product.category,
      image: product.urlImg,
      direc: product.direc,
      nivel: product.nivel
    }));
  } catch (err) {
    console.error('Error al leer productos desde la base de datos:', err);
    return [];
  }
};

// Enviar productos actualizados a todos los clientes si hay cambios
const sendProductsToAll = async () => {
  const products = await fetchProductsFromDB();

  if (JSON.stringify(products) !== JSON.stringify(lastProducts)) {
    Object.values(connections).forEach(connection => {
      connection.send(JSON.stringify(products));
    });

    console.log('Productos enviados a todos los clientes.');
    lastProducts = products; // Actualizar la lista de productos anterior
  }
};

// Enviar productos solo al nuevo cliente al conectar
const sendProductsToClient = async (connection) => {
  const products = await fetchProductsFromDB();
  connection.send(JSON.stringify(products));
};

// Configurar el intervalo de consulta periódica (ej., cada 10 segundos)
setInterval(sendProductsToAll, 10000);

// Función genérica para publicar en MQTT
const publishToMQTT = (topic, value) => {
  if (value !== undefined && value !== null && value !== '') {
    const message = value.toString(); // Convertir el valor a una cadena
    client.publish(topic, message, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(`Error al publicar en MQTT en el tópico ${topic}:`, error);
      } else {
        console.log(`Valor publicado en MQTT en el tópico ${topic}:`, message);
      }
    });
  } else {
    console.error('Valor no válido para publicar:', value);
  }
};

// Manejar mensajes recibidos del cliente
wsServer.on('connection', async (connection, request) => {
  const { username } = url.parse(request.url, true).query;

  const uuid = uuidv4();
  const userName = username || `user_${uuid}`;  // Valor por defecto si no hay username

  console.log(`${userName} conectado con ID ${uuid}`);
  connections[uuid] = connection;

  users[uuid] = {
    username: userName,
    products: [{}],
  };

  console.log(`Usuario ${userName} ha sido agregado a la lista de usuarios.`);

  // Enviar productos desde la base de datos al cliente que se conecta
  sendProductsToClient(connection);

  // Manejar mensajes recibidos del cliente
  connection.on('message', async (message) => {
    console.log(`Mensaje recibido de ${userName}:`, message);
  
    try {
      let cleanMessage = '';
  
      if (Buffer.isBuffer(message)) {
        cleanMessage = message.toString();
      } else if (typeof message === 'string') {
        cleanMessage = message.trim();
      }
  
      if (!cleanMessage) return;
  
      const data = JSON.parse(cleanMessage);
      switch (data.type) {
        case 'newProduct':
          console.log('Procesando nuevo producto:', data);
          const { id, name, stock, urlImg, category } = data;
          
          // Validar la entrada de datos
          if (!id || !name || !stock || !urlImg || !category) {
            connection.send(JSON.stringify({
              status: 'error',
              message: 'Faltan datos necesarios para agregar el producto.'
            }));
            return;
          }
          
          try {
            let pool = await sql.connect(dbConfig);
            const request = pool.request();
        
            // Insertar el nuevo producto en la base de datos
            const result = await request.input('id', sql.NVarChar, id)
              .input('name', sql.NVarChar, name)
              .input('stock', sql.Int, stock)
              .input('urlImg', sql.NVarChar, urlImg)
              .input('category', sql.NVarChar, category)
              .query(`
                INSERT INTO Productos (id, name, stock, urlImg, category)
                VALUES (@id, @name, @stock, @urlImg, @category)
              `);
        
            console.log('Nuevo producto agregado a la base de datos:', result);
        
            // Enviar productos actualizados a todos los clientes (si es necesario)
            sendProductsToAll();
            
            connection.send(JSON.stringify({
              status: 'success',
              message: 'Producto agregado correctamente.'
            }));
          } catch (err) {
            console.error('Error al agregar producto:', err);
            connection.send(JSON.stringify({
              status: 'error',
              message: 'Error al agregar producto a la base de datos.'
            }));
          }
          break;

        // Otros casos de mensaje aquí...

      }
    } catch (err) {
      console.error('Error al procesar mensaje:', err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});
