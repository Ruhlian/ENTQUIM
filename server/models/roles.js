const db = require('../config/conexion');

class Rol {
    static getAllRoles(callback) {
        const query = 'SELECT * FROM roles';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Rol;
