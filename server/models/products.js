const db = require('../config/conexion');

class Producto {
    static getAllProductos(callback) {
        const query = 'SELECT * FROM productos';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Producto;
