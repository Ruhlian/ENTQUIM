const express = require('express');
const cors = require('cors');
const path = require('path'); // Importar el módulo 'path'
const usuariosR = require('./routes/usersRoute'); // Ruta para usuarios
const productosR = require('./routes/productsRoute'); // Ruta para productos
const contactR = require('./routes/contactRoute'); // Ruta para contacto
const metodoPagoR = require('./routes/paymentMethodRoute'); // Ruta para métodos de pago
const ventasRoutes = require('./routes/soldsRoute');
const cleanExpiredTokens = require('./scripts/tokenCleaner'); // Importar el limpiador de tokens
require('dotenv').config(); // Cargar las variables de entorno

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Para verificar que la variable se está cargando

const app = express(); // Crear la aplicación Express

// Middleware
app.use(cors()); // Permitir CORS
app.use(express.json()); // Analizar cuerpos JSON

// Servir archivos estáticos desde la carpeta 'assets'
app.use('/api/assets', express.static(path.join(__dirname, 'assets'))); // Cambia 'assets' por el nombre de tu carpeta

// Usar rutas
app.use('/api/usuarios', usuariosR); // Ruta de usuarios
app.use('/api/productos', productosR); // Ruta de productos
app.use('/api/contacto', contactR); // Ruta para enviar correos
app.use('/api/metodos-pago', metodoPagoR); // Ruta para métodos de pago
app.use('/api/ventas', ventasRoutes);

// Manejo de errores 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Configurar el puerto usando una variable de entorno
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Iniciar la limpieza de tokens expirados
cleanExpiredTokens();
