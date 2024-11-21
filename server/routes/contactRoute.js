// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

// Ruta para enviar el correo
router.post('/enviar-correo', sendContactEmail);

module.exports = router;
