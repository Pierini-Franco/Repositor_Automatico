function NuevoProd(Name,RutImag,NumStock){
    // Crear un nuevo elemento div para el producto
    var productDiv = document.createElement("div");
    productDiv.className = "product"; // Agregar la clase "product" al div

    // Crear un elemento de imagen
    var imgElement = document.createElement("img");
    imgElement.src = RutImag; // Establecer la ruta de la imagen
    imgElement.alt = "imagen " + Name; // Establecer el texto alternativo

    // Crear un encabezado h2 para el nombre del producto
    var h2Element = document.createElement("h2");
    h2Element.textContent = Name; // Establecer el texto del encabezado

    // Crear un párrafo para mostrar el stock
    var stockParagraph = document.createElement("p");
    stockParagraph.textContent = "Stock: ";

    // Crear un elemento span para mostrar el valor del stock
    var stockSpan = document.createElement("span");
    stockSpan.id = "stock" + Name; // Establecer el id del span
    stockSpan.textContent = NumStock; // Establecer el valor del stock

    // Agregar el span al párrafo de stock
    stockParagraph.appendChild(stockSpan);

    // Crear un input para la cantidad del producto
    var quantityInput = document.createElement("input");
    quantityInput.className = "quantity-input"; // Agregar la clase "quantity-input" al input
    quantityInput.type = "number";
    quantityInput.id = "quantityInput" + Name; // Establecer el id del input
    quantityInput.min = "0";
    quantityInput.max = NumStock;

    // Crear un párrafo para mostrar la cantidad en el carrito
    var cartCountParagraph = document.createElement("p");
    cartCountParagraph.textContent = "Cantidad en el carrito: ";

    // Crear un elemento span para mostrar el valor de la cantidad en el carrito
    var cartCountSpan = document.createElement("span");
    cartCountSpan.id = "cartCount1"; // Establecer el id del span
    cartCountSpan.textContent = "0"; // Establecer el valor de la cantidad en el carrito            <<<<<<<<<<<================================================

    // Agregar el span al párrafo de cantidad en el carrito
    cartCountParagraph.appendChild(cartCountSpan);

    // Agregar todos los elementos al div del producto
    productDiv.appendChild(imgElement);
    productDiv.appendChild(h2Element);
    productDiv.appendChild(stockParagraph);
    productDiv.appendChild(quantityInput);
    productDiv.appendChild(cartCountParagraph);

    // Agregar el div del producto al documento
    document.body.appendChild(productDiv);

}