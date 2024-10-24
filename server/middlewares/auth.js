const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const verified = jwt.verify(token, 'proyectosena123'); // Cambia esto a tu clave secreta
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token inválido.' });
    }
}

module.exports = authMiddleware;
