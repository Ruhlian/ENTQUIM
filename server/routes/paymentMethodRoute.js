const express = require('express');
const router = express.Router();
const MetodoPagoController = require('../controllers/paymentMethodController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas protegidas con authMiddleware
router.get('/user', authMiddleware, MetodoPagoController.getAllPaymentMethodsByUserId);
router.post('/', authMiddleware, MetodoPagoController.createPaymentMethod);
router.delete('/:id_metodo_pago', authMiddleware, MetodoPagoController.deletePaymentMethodById);

module.exports = router;
