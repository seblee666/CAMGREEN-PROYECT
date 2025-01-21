const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Configuración de conexión a PostgreSQL
const pool = new Pool({
    connectionString: 'postgresql://logincamgreen_db_user:DBkUdi9tt7QxiqKGRRfNrVOS1REE38hx@dpg-cu471ntds78s739p6gbg-a.oregon-postgres.render.com:5432/logincamgreen_db', // URL de la base de datos
    ssl: {
        rejectUnauthorized: false, // Configuración necesaria para Render
    },
});

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Analizar JSON en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true })); // Analizar datos de formularios
app.use(express.static(path.join(__dirname, './'))); // Archivos estáticos desde la raíz

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta del dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Ruta para manejo de inicio de sesión
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validación básica de campos
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
        }

        // Consulta a la base de datos
        const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }

        const user = result.rows[0];

        // Validación de contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Verificar si el usuario está activo
        if (!user.estado) {
            return res.status(403).json({ message: 'Usuario inactivo.' });
        }

        // Respuesta exitosa con información del usuario
        res.json({
            message: 'Inicio de sesión exitoso',
            redirect: '/dashboard',
            user: {
                id: user.id,
                username: user.username,
                nombres: user.nombres,
                apellidos: user.apellidos,
                email: user.email,
                fullName: `${user.nombres} ${user.apellidos}`,
            },
        });
    } catch (error) {
        console.error('Error en /api/login:', error.message);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
