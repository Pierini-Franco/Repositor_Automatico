// config.js
export const mqttOptions = {
      clientId: `emqxkosmos2024${Math.random().toString(16).substring(2, 8)}`,
      username: 'KosmosBrocker',
      password: 'kosmos2024',
      host: 'mqtt://broker.emqx.io:1883',
    };

  export const topic = 'pedido';
  export const qos = 0;
  