import { conectarDB } from '../db/connection';

export async function getAllProducts() {
    try {
      const pool = await conectarDB();
  
      // Consultar todos los productos
      const result = await pool.request().query('SELECT id, name, stock, urlImg FROM productos');
  
      // Mapeo de los resultados a un array con el formato deseado
      const products = result.recordset.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.Stock,
        image: product.urlImg || 'https://via.placeholder.com/200', // URL de imagen por defecto si no existe
      }));
  
      // Cerrar la conexión
      await pool.close();
  
      return products; // Retorna el array de productos
    } catch (err) {
      console.error('Error ejecutando la consulta:', err.message);
      return []; // Retorna un array vacío en caso de error
    }
  }