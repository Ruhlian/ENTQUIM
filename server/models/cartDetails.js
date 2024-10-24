const db = require('../config/conexion');

class CarritoDetalles {
    static getAllDetalles(callback) {
        const query = 'SELECT * FROM carrito_detalles';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = CarritoDetalles;
