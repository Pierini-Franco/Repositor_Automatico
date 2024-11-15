// Función para mostrar las categorías
function showCategory(category) {
    // Primero ocultamos todas las categorías
    const categories = document.querySelectorAll('.content-category');
    categories.forEach((section) => {
        section.classList.remove('show');
    });

    // Luego mostramos la categoría seleccionada
    const selectedCategory = document.getElementById(category);
    if (selectedCategory) {
        selectedCategory.classList.add('show');
    }
}

// Mostrar la sección de Wiki por defecto
document.addEventListener("DOMContentLoaded", () => {
    showCategory('wiki');
});
