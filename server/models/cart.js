const db = require('../config/conexion');

class Carrito {
    static getAllCarritos(callback) {
        const query = 'SELECT * FROM carrito';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Carrito;
