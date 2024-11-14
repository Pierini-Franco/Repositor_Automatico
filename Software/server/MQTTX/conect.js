// mqttClient.js
const mqtt = require('mqtt');
const { brokerUrl, options } = require('./config');

// Conecta al broker MQTT
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log('Conectado al broker');
});

client.on('error', (error) => {
    console.error('Error de conexión:', error);
});

module.exports = clientMQTTX;
