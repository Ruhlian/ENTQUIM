const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        // Extrae el id del usuario para usar en los controladores
        req.user = decoded; // `decoded` debe contener `id` y `rol` del token JWT
        next();
    });
};

module.exports = authMiddleware;
