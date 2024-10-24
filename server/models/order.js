const db = require('../config/conexion');

class Orden {
    static getAllOrdenes(callback) {
        const query = 'SELECT * FROM ordenes';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Orden;
