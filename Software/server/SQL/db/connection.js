// /db/connection.js

import sql from 'mssql'; // Cambiado a import
import {dbConfig} from './config.js'; // Asegúrate de que config.js esté exportando con ES6

// Función para conectarse a la base de datos y devolver la conexión
export async function conectarDB() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Conectado a la base de datos SQL Server');
    return pool;
  } catch (err) {
    console.error('Error conectando a la base de datos:', err);
    throw err;
  }
}
