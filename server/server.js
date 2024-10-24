const express = require('express');
const cors = require('cors');
const usuariosR = require('./routes/users'); // Ruta para usuarios
require('dotenv').config(); // Cargar las variables de entorno

// Imprimir el valor de JWT_SECRET para verificar que se está cargando correctamente
console.log('JWT_SECRET:', process.env.JWT_SECRET); 

const app = express(); // Crear la aplicación Express

app.use(cors()); // Permitir CORS
app.use(express.json()); // Analizar cuerpos JSON

// Usar rutas
app.use('/api/usuarios', usuariosR);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Configurar el puerto
const PORT = process.env.PORT || 3002; // Puedes usar una variable de entorno para el puerto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
