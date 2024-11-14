const { conectarDB } = require('./db/connection');

export async function insertData(productId, name, stock, urlImg, category) {
  try {
    const pool = await conectarDB();

    // Insertar en la tabla usando los valores pasados como parámetros
    await pool.request()
      .input('id', productId)
      .input('name', name)
      .input('stock', stock)
      .input('urlImg', urlImg)
      .input('category', category)
      .query('INSERT INTO productos (id, name, stock, urlImg, category) VALUES (@id, @name, @stock, @category, @urlImg, @category)');

    // Ejecutar la consulta SQL para verificar los datos insertados
    const result = await pool.request().query('SELECT * FROM productos');

    // Retornar los resultados como un array de objetos
    const productsArray = result.recordset.map(producto => ({
      id: producto.id,
      stock: producto.Stock, // Asegúrate de que el nombre de la propiedad coincide con la base de datos
      urlImg: producto.urlImg,
      category: producto.category,
    }));

    // Cerrar la conexión
    await pool.close();
    
    return productsArray; // Retorna el array de productos
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    return []; // Retorna un array vacío en caso de error
  }
}

