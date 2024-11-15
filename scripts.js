function loadContent(section) {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = ''; // Limpiar el contenido anterior

    fetch(`content/${section}.html`)
        .then(response => response.text())
        .then(data => {
            contentContainer.innerHTML = data; // Insertar el contenido cargado
        })
        .catch(error => {
            contentContainer.innerHTML = '<p>Hubo un error al cargar el contenido.</p>';
            console.error(error);
        });
}

// Cargar la sección "wiki" por defecto al inicio
window.onload = function() {
    loadContent('wiki');
};
