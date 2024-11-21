const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productsController');

// Rutas de productos
router.get('/', ProductoController.getAll); // Obtener todos los productos
router.get('/:id', ProductoController.getById); // Obtener un producto por ID
router.post('/', ProductoController.upload.single('imagen'), ProductoController.create); // Crear un nuevo producto
router.put('/:id', ProductoController.upload.single('imagen'), ProductoController.update); // Actualizar un producto por ID
router.delete('/:id', ProductoController.delete); // Eliminar un producto por ID
router.get('/categoria/:id_categoria', ProductoController.getByCategoria); // Obtener productos por categoría

module.exports = router;
