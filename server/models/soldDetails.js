const db = require('../config/conexion');

class DetalleDeVenta {
    static getAllDetalles(callback) {
        const query = 'SELECT * FROM detalles_de_ventas';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = DetalleDeVenta;
