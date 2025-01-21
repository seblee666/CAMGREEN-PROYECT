const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://logincamgreen_db_user:DBkUdi9tt7QxiqKGRRfNrVOS1REE38hx@dpg-cu471ntds78s739p6gbg-a.oregon-postgres.render.com:5432/logincamgreen_db',
    ssl: {
        rejectUnauthorized: false, // Necesario para Render u otros servicios externos
    },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sirve archivos estáticos desde el directorio raíz
app.use(express.static(path.join(__dirname, './')));

// Ruta para servir la página principal de inicio de sesión
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Ruta para servir el dashboard después del inicio de sesión
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Ruta para manejar el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar que los datos enviados no estén vacíos
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
        }

        // Consultar al usuario en la base de datos
        const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }

        const user = result.rows[0];

        // Verificar que el hash de la contraseña existe
        if (!user.password_hash) {
            return res.status(500).json({ message: 'Error en los datos del usuario.' });
        }

        // Verificar la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Verificar si el usuario está activo
        if (!user.estado) {
            return res.status(403).json({ message: 'Usuario inactivo.' });
        }

        // Responder con el nombre completo y redirección
        res.json({
            message: `Inicio de sesión exitoso`,
            redirect: '/dashboard',
            user: {
                id: user.id,
                username: user.username,
                nombres: user.nombres,
                apellidos: user.apellidos,
                email: user.email,
                fullName: `${user.nombres} ${user.apellidos}`, // Nombre completo
            },
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Puerto para el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
