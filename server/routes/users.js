const express = require('express');
const router = express.Router();
const { getAllUsers, login, register, deleteUserById } = require('../controllers/users');

// Ruta para obtener todos los usuarios
router.get('/', getAllUsers);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para eliminar un usuario
router.delete('/:id', deleteUserById);

module.exports = router;
