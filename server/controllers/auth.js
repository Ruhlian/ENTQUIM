const connection = require('../config/conexion');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para buscar un usuario por correo
const findUserByEmail = async (correo) => {
    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [correo], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Función para validar la contraseña
const validatePassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword);
};

// Generar token
const generateToken = (user) => {
    return jwt.sign({ id: user.UsuarioId }, 'secretojwt', { expiresIn: '1h' });
};

// Controlador de inicio de sesión
const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const results = await findUserByEmail(correo);
        const user = results[0];

        if (!user || !await validatePassword(contrasena, user.contrasena)) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const token = generateToken(user);
        res.json({ token, user: { id: user.UsuarioId, correo: user.correo } });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

module.exports = { login };
