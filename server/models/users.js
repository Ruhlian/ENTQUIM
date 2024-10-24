const db = require('../config/conexion');

class Usuario {
    // Obtener todos los usuarios
    static getAllUsers(callback) {
        const query = 'SELECT * FROM Usuarios';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }

    // Buscar usuario por correo
    static findByEmail(correo, callback) {
        const query = 'SELECT * FROM Usuarios WHERE correo = ?';
        db.query(query, [correo], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    }

    static createUser(userData, callback) {
        const { correo, contrasena, nombre, apellido, rol } = userData;
        const query = 'INSERT INTO Usuarios (correo, contrasena, nombre, apellido, id_rol) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [correo, contrasena, nombre, apellido, rol], (err, results) => {
            if (err) return callback(err, null);
            callback(null, { id: results.insertId, ...userData });
        });
    }

    static deleteUserById(id, callback) {
        const query = 'DELETE FROM Usuarios WHERE id_usuarios = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Usuario;
