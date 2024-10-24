const db = require('../config/conexion');

class Categoria {
    static getAllCategorias(callback) {
        const query = 'SELECT * FROM categorias';
        db.query(query, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = Categoria;
