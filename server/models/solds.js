const db = require('../config/conexion');

class Venta {
    static getAllVentas(callback) {
        const query = 'SELECT * FROM ventas';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Venta;
