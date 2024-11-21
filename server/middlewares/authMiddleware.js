const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    console.log('Token recibido en las cabeceras:', token); // Log para ver el token recibido en las cabeceras

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err); // Log para ver el error al verificar el token
            return res.status(403).json({ message: 'Token inválido' });
        }

        console.log('Token verificado correctamente, datos decodificados:', decoded); // Log para ver los datos decodificados

        // Asigna el usuario decodificado a req.user
        req.user = { id: decoded.id, rol: decoded.rol };

        next();
    });
};


module.exports = authMiddleware;
