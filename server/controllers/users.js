const connection = require('../config/conexion');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
    const query = 'SELECT * FROM usuarios';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos.' });
        }
        res.json(results);
    });
};

// Iniciar sesión
const login = (req, res) => {
    const { correo, contrasena } = req.body;

    const query = 'SELECT * FROM usuarios WHERE correo = ?';

    connection.query(query, [correo], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const token = jwt.sign({ id: user.UsuarioId, rol: user.ID_Rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Login exitoso' });
    });
};

// Registrar un nuevo usuario
const register = async (req, res) => {
    const { nombre, apellido, correo, contrasena, ID_Rol } = req.body;

    // Establecer un valor por defecto para ID_Rol
    const defaultRoleId = 3; // ID_Rol por defecto

    // Usar el ID_Rol proporcionado o el por defecto
    const roleId = ID_Rol ? ID_Rol : defaultRoleId; // Si 'ID_Rol' es undefined o null, usar defaultRoleId

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !apellido || !correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        // Comprobar si el correo ya está en uso
        const existingUser = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Usuarios WHERE correo = ?';
            connection.query(query, [correo], (err, results) => {
                if (err) {
                    console.error('Error al consultar el usuario existente:', err); // Mensaje de error
                    return reject(err);
                }
                resolve(results[0]); // Devolver el primer resultado o undefined
            });
        });

        if (existingUser) {
            return res.status(409).json({ error: 'El correo ya está registrado.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Crear un nuevo usuario en la base de datos
        const newUser = await new Promise((resolve, reject) => {
            const query = 'INSERT INTO usuarios (correo, contrasena, nombre, apellido, id_rol) VALUES (?, ?, ?, ?, ?)';
            connection.query(query, [correo, hashedPassword, nombre, apellido, roleId], (err, results) => {
                if (err) {
                    console.error('Error al registrar el usuario:', err); // Mensaje de error
                    return reject(err);
                }
                resolve({ id: results.insertId, correo, nombre, apellido, ID_Rol: roleId });
            });
        });

        res.status(201).json({ message: 'Registro exitoso', user: newUser });
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
};

// Eliminar un usuario por ID
const deleteUserById = (req, res) => {
    const { id } = req.params;

    // Asegúrate de que este sea el nombre correcto de la columna en tu base de datos
    const query = 'DELETE FROM Usuarios WHERE id_usuarios = ?'; 

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err); // Mensaje de error detallado
            return res.status(500).json({ error: 'Error en la base de datos.', details: err });
        }

        // Verificar si se eliminó algún usuario
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Mensaje de éxito
        res.json({ message: 'Usuario eliminado exitosamente' });
    });
};

// Exportar las funciones del controlador
module.exports = {
    getAllUsers,
    login,
    register,
    deleteUserById
};
