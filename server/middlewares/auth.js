const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Extrae el token del encabezado de autorización con verificación robusta
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;
    
    console.log('Token recibido:', token); // Log para ver el token recibido

    // Verifica si el token está presente
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token' });
    }

    // Verifica y decodifica el token usando el secreto
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token inválido:', err.message); // Log para ver el error de verificación
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = user; // Asigna el usuario decodificado a la solicitud
        console.log('Usuario autenticado:', user); // Log para ver el usuario autenticado
        next(); // Llama al siguiente middleware o ruta
    });
};

module.exports = authMiddleware;
