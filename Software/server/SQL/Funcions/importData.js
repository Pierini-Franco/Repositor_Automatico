//Importa datos de un id en especifico
const { conectarDB } = require('./db/connection');

export async function importData(name) {
    try {
      const pool = await conectarDB();
  
      // Consultar en la tabla usando el `productId` como filtro
      const result = await pool.request()
        .input('name', name)
        .query('SELECT * FROM productos WHERE name = @name');
  
      // Verificar si el producto existe
      if (result.recordset.length === 0) {
        throw new Error(`No se encontró un producto con el name: ${name}`);
      }
  
      // Extraer los valores y almacenarlos en un array
      const productArray = [
        result.recordset[0].id,
        result.recordset[0].name,
        result.recordset[0].Stock,
        result.recordset[0].urlImg,
        result.recordset[0].category
      ];
  
      // Cerrar la conexión
      await pool.close();
  
      return productArray; // Retorna el array de valores
    } catch (err) {
      console.error('Error ejecutando la consulta:', err.message);
      return `Error: ${err.message}`; // Retorna el mensaje de error
    }
  }