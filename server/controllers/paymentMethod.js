const MetodoPago = require('../models/paymentMethod');

class MetodoPagoController {
    static getAllPaymentMethodsByUserId(req, res) {
        const userId = req.userId;  // Extrae el userId desde el middleware
        MetodoPago.getAllPaymentMethodsByUserId(userId, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }

    static createPaymentMethod(req, res) {
        const paymentData = {
            ...req.body,
            id_usuarios: req.userId  // Asigna el userId al método de pago
        };

        // Validaciones adicionales si es necesario
        if (!paymentData.numero_tarjeta || paymentData.numero_tarjeta.length !== 16) {
            return res.status(400).json({ error: 'Número de tarjeta inválido.' });
        }

        MetodoPago.createPaymentMethod(paymentData, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(result);
        });
    }

    static deletePaymentMethodById(req, res) {
        const idMetodoPago = req.params.id_metodo_pago;
        MetodoPago.deletePaymentMethodById(idMetodoPago, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Método de pago eliminado correctamente.' });
        });
    }
}

module.exports = MetodoPagoController;

