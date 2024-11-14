import { useEffect, useState, useCallback } from 'react';

const useWebSocket = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket(url);
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('Conexión WebSocket abierta');
        };

        newSocket.onmessage = (event) => {
            console.log('Mensaje recibido del WebSocket:', event.data);
            try {
                // Intentamos parsear los datos recibidos como JSON
                const parsedData = JSON.parse(event.data);
                console.log('Datos recibidos:', parsedData);

                // Verificamos si los datos recibidos son un array
                if (Array.isArray(parsedData)) {
                    setData(parsedData); // Actualizamos el estado con los productos recibidos
                } else {
                    console.error('Los datos recibidos no son un array:', parsedData);
                }
            } catch (error) {
                console.error('Error al analizar los datos:', error);
            }
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError(error);
        };

        newSocket.onclose = () => {
            console.log('Conexión WebSocket cerrada');
        };

        return () => {
            newSocket.close();
            console.log('WebSocket cerrado');
        };
    }, [url]);

    // Función para enviar mensajes
    const sendMessage = useCallback((message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          // Asegúrate de convertir el mensaje en JSON solo si no es ya un objeto
          if (typeof message === "object") {
            message = JSON.stringify(message);  // Si es un objeto, conviértelo a JSON
          }
          socket.send(message);
          console.log('Mensaje enviado:', message);  // Esto debería mostrar el mensaje correctamente
        } else {
          console.error('No se puede enviar el mensaje, el socket no está abierto');
        }
      }, [socket]);
      

    return { data, error, sendMessage };
};

export default useWebSocket;
