// mqttFunctions.js
const clientMQTTX = require('./clientMQTTX');

// Función para suscribirse a un tema
function suscribirseTema(topic) {
    clientMQTTX.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Suscrito al tema ${topic}`);
        } else {
            console.error('Error al suscribirse:', err);
        }
    });
}

// Función para publicar un mensaje
function publicarMensaje(topic, message) {
    clientMQTTX.publish(topic, message, (err) => {
        if (!err) {
            console.log(`Mensaje publicado en ${topic}: ${message}`);
        } else {
            console.error('Error al publicar el mensaje:', err);
        }
    });
}

// Evento para recibir mensajes
clientMQTTX.on('message', (topic, message) => {
    console.log(`Mensaje recibido del tema ${topic}: ${message.toString()}`);
});

// Exporta las funciones
module.exports = { suscribirseTema, publicarMensaje };
