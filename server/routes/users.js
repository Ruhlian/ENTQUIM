const express = require('express');
const router = express.Router();
const { getAllUsers, login, register, deleteUserById, changeUserRole, logout, verifyToken, invalidateToken, deleteTokenById } = require('../controllers/users');

// Ruta para obtener todos los usuarios
router.get('/', getAllUsers);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para eliminar un usuario
router.delete('/:id', deleteUserById);

// Ruta para cambiar el rol de un usuario
router.put('/changeRole/:id', changeUserRole);

// Ruta para cerrar sesión
router.post('/logout', logout); // Ruta para cerrar sesión

// Ruta para verificar el token
router.get('/verify-token', verifyToken);

//invalida el token al cerrar la sesion
router.post('/invalidate-token', invalidateToken);

// Ruta para eliminar el token por su id
router.delete('/tokens/:id', deleteTokenById); 

module.exports = router;
