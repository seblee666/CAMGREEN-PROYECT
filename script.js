// Escucha el evento de envío del formulario
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue

    const username = document.getElementById('username').value; // Captura el username
    const password = document.getElementById('password').value; // Captura la contraseña
    const errorMessage = document.getElementById('error-message'); // Captura el contenedor de mensajes de error

    try {
        // Enviar solicitud POST al servidor
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Enviar datos al servidor
        });

        const data = await response.json(); // Convertir la respuesta a JSON

        if (response.ok) {
            // Mostrar el nombre completo del usuario en el cuadro de alerta
            alert(`Inicio de sesión exitoso. Bienvenido, ${data.user.fullName}.`);

            // Redirigir al dashboard
            window.location.href = data.redirect;
        } else {
            // Mostrar mensaje de error en letras rojas debajo del formulario
            errorMessage.textContent = data.message;
            errorMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error); // Log del error
        errorMessage.textContent = 'Ocurrió un error al intentar iniciar sesión.';
        errorMessage.style.color = 'red';
    }
});
