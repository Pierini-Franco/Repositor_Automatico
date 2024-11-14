import { useState } from "react";
import './NewProduct.css';
import { categoryOptions } from "../data/CategoryOptions.jsx";
import { PlusIcon } from "./Icons.jsx";

export function NewProduct({ onNewProduct, sendMessage }) {
  const [productId, setProductId] = useState(""); 
  const [productName, setProductName] = useState(""); 
  const [stock, setStock] = useState(""); 
  const [urlImg, setImg] = useState(""); 
  const [category, setCategory] = useState(""); 
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar que todos los campos estén llenos
    if (!productId || !productName || !stock || !urlImg || !category) {
      console.error("Todos los campos deben estar llenos.");
      return;
    }

    // Verificar que el stock sea un número válido
    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock)) {
      console.error("El stock debe ser un número válido.");
      return;
    }

    // Crear el objeto del nuevo producto
    const newProduct = {
      type: 'newProduct',
      id: productId,
      name: productName,
      stock: parsedStock,
      urlImg,
      category,
    };

    // Verificar si el objeto puede ser convertido a JSON
    try {
      const jsonProduct = JSON.stringify(newProduct);
      sendMessage(jsonProduct); // Enviar el mensaje
      onNewProduct(newProduct); // Actualizar el estado del producto
      console.log('Mensaje enviado:', jsonProduct);
      setShowForm(false);  // Cierra el formulario después de enviar
    } catch (error) {
      console.error('Error al convertir el producto a JSON:', error);
    }
  };

  return (
    <>
      {/* Al hacer clic en el botón "+" muestra u oculta el formulario */}
      <button onClick={() => setShowForm((prev) => !prev)} className="showFormButton">
        <PlusIcon />
      </button>
      
      {showForm && (
        <section className="newProductCard">
          <strong className="titleLogin">New Product</strong>
          <form onSubmit={handleSubmit}>
            <div>
              <span>ID de producto: </span>
              <input 
                type="text"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)} 
              />
            </div>
            <div>
              <span>Ingresar nombre de producto: </span>
              <input 
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)} 
              />
            </div>
            <div>
              <span>Ingresar Stock: </span>
              <input 
                type="text"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)} 
              />
            </div>
            <div>
              <span>Ingresar URL de imagen: </span>
              <input 
                type="text"
                placeholder="Image URL"
                value={urlImg}
                onChange={(e) => setImg(e.target.value)} 
              />
            </div>
            <div>
              <span>Seleccionar Categoría: </span>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                {categoryOptions.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </section>
      )}
    </>
  );
}
