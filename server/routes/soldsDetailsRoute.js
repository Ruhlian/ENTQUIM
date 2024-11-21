const express = require('express');
const router = express.Router();
const detallesDeVentaController = require('../controllers/soldsDetailsController');

router.get('/', detallesDeVentaController.getAllDetalles);
router.post('/', detallesDeVentaController.createDetalleDeVenta);
router.get('/:id', detallesDeVentaController.getDetalleById);
router.delete('/:id', detallesDeVentaController.deleteDetalleDeVenta);

module.exports = router;
