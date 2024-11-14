// index.js
import http from 'http';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';
import sql from 'mssql';
import { dbConfig } from './SQL/db/config.js';

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const PORT = 8000;

const users = {};
const connections = {};
let lastProducts = [];

// Función para leer productos desde la base de datos
const fetchProductsFromDB = async () => {   
    try {
        let pool = await sql.connect(dbConfig);
        const request = pool.request();
        const result = await request.query('SELECT * FROM productos');

        return result.recordset.map(product => ({
            id: product.id,
            name: product.name,
            stock: product.stock,
            category: product.category,
            image: product.urlImg
        }));
    } catch (err) {
        console.error('Error al leer productos desde la base de datos:', err);
        return [];
    }
};

// Enviar productos actualizados a todos los clientes si hay cambios
const sendProductsToAll = async () => {
    const products = await fetchProductsFromDB();

    // Comparar con la última lista de productos enviada
    if (JSON.stringify(products) !== JSON.stringify(lastProducts)) {
        console.log('Productos actualizados:', products);

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

// Evento de conexión al servidor WebSocket
wsServer.on('connection', (connection, request) => {
    const { username } = url.parse(request.url, true).query;
    const uuid = uuidv4();

    console.log(`${username} conectado con ID ${uuid}`);
    connections[uuid] = connection;

    users[uuid] = {
        username: username,
        products: [{}],
    };

    console.log(`Usuario ${username} ha sido agregado a la lista de usuarios.`);

    // Enviar productos desde la base de datos al cliente que se conecta
    sendProductsToClient(connection);

    // Manejar desconexión del cliente
    connection.on('close', () => {
        console.log(`${username} desconectado`);
        delete users[uuid];
        delete connections[uuid];
        console.log(`Usuario ${username} ha sido eliminado de la lista de usuarios.`);
    });
});

// Configurar el servidor para escuchar en el puerto especificado
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
