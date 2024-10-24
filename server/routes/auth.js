// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth');

// Ruta para iniciar sesión
router.post('/login', login);

module.exports = router;
