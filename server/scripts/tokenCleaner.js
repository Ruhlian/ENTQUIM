// tokenCleaner.js
const connection = require('../config/conexion');

const cleanExpiredTokens = async () => {
    try {
        const currentTime = new Date();

        // Eliminar tokens cuya fecha de expiración ya ha pasado
        const query = 'DELETE FROM tokens_usuarios WHERE expires_at < ?';
        connection.query(query, [currentTime], (error, results) => {
            if (error) {
                console.error('Error al limpiar tokens expirados:', error);
                return;
            }
            console.log(`Tokens expirados eliminados: ${results.affectedRows}`);
        });
    } catch (error) {
        console.error('Error en la función de limpieza de tokens:', error);
    }
};

// Ejecutar cada hora
setInterval(cleanExpiredTokens, 3600000); // 3600000 ms = 1 hora

module.exports = cleanExpiredTokens; // Exportar la función para usarla en server.js
