const db = require('../config/conexion');

class MetodoPago {
    // Obtener todos los métodos de pago de un usuario
    static getAllPaymentMethodsByUserId(userId, callback) {
        const query = 'SELECT * FROM Metodos_Pago WHERE id_usuarios = ?';
        db.query(query, [userId], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }

    // Crear un método de pago
    static createPaymentMethod(paymentData, callback) {
        const {
            id_usuarios,
            nombre_titular,
            numero_tarjeta,
            mm_aa,
            cvc,
            direccion,
            ciudad,
            pais
        } = paymentData;
    
        const query = `
            INSERT INTO Metodos_Pago (id_usuarios, nombre_titular, numero_tarjeta, mm_aa, cvc, direccion, ciudad, pais) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
        db.query(query, [id_usuarios, nombre_titular, numero_tarjeta, mm_aa, cvc, direccion, ciudad, pais], (err, results) => {
            if (err) return callback(err, null);
            callback(null, { id_metodo_pago: results.insertId, ...paymentData });
        });
    }
    
    // Eliminar un método de pago por ID
    static deletePaymentMethodById(id_metodo_pago, callback) {
        const query = 'DELETE FROM Metodos_Pago WHERE id_metodo_pago = ?';
        db.query(query, [id_metodo_pago], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    }
}

module.exports = MetodoPago;
