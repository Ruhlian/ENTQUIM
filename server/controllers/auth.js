const connection = require('../config/conexion');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { correo, contrasena } = req.body; // Cambiado de email y password a correo y contrasena

    // Consulta para buscar al usuario por correo
    const query = 'SELECT * FROM usuarios WHERE correo = ?';

    connection.query(query, [correo], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const user = results[0];

        // Comparar la contraseña con bcrypt
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        // Crear un token JWT
        const token = jwt.sign({ id: user.UsuarioId }, 'secretojwt', { expiresIn: '1h' });

        res.json({ token, message: 'Login exitoso' });
    });
};

module.exports = { login };
