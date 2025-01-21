// Añadir evento para cambiar la clase activa en la barra de navegación
const navLinks = document.querySelectorAll('.sidebar nav ul li a');

// Guardar y restaurar estado activo
navLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
        link.parentElement.classList.add('active');
        localStorage.setItem('activeLink', index); // Guarda el índice del enlace activo
    });

    // Navegación con teclado
    link.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            link.click();
        }
    });
});

// Restaurar el enlace activo al cargar la página
const activeIndex = localStorage.getItem('activeLink');
if (activeIndex !== null) {
    navLinks[activeIndex].parentElement.classList.add('active');
}

// Evento de clic para cerrar sesión
document.getElementById('logout').addEventListener('click', () => {
    const confirmLogout = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmLogout) {
        window.location.href = 'index.html'; // Redirige al usuario a index.html
    }
});
document.getElementById('actividades').addEventListener('click', () => {
        window.location.href = 'tasks.html'; 
});
document.getElementById('inicio').addEventListener('click', () => {
    window.location.href = 'dashboard.html'; 
});
document.getElementById('healthy-life').addEventListener('click', () => {
    window.location.href = 'healthy-life.html'; 
});
document.getElementById('logros').addEventListener('click', () => {
    window.location.href = 'logros.html';
});
document.getElementById('Estadisticas').addEventListener('click', () => {
    window.location.href = 'estadisticas.html';
});
document.getElementById('perfil').addEventListener('click', () => {
    window.location.href = 'perfil.html';
});