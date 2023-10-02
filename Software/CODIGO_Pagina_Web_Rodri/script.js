/*document.getElementById("order_buttonjs").addEventListener("click", function() {
    // Guarda el valor 1 en una variable o en localStorage, dependiendo de tus necesidades
    var valor = 1;

    // Ejemplo de cómo guardar el valor en localStorage
    localStorage.setItem("miValor", valor);

    // Puedes mostrar un mensaje para confirmar que se ha guardado el valor
    alert("Se ha guardado el valor 1.");
});*/

function save_data(){
    var product_name = document.getElementById("product").value;
    var quantity_product = document.getElementById("quantity").value;

    alert("Se han guardado los datos\n\nProducto: " + product_name + "\nCantidad: " + quantity_product);
}