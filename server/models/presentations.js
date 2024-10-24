const db = require('../config/conexion');

class Presentacion {
    static getAllPresentaciones(callback) {
        const query = 'SELECT * FROM presentaciones';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Presentacion;
