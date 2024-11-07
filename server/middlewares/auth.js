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

        // Extrae el id y rol del usuario del token y lo asigna a req.userId y req.userRole
        req.userId = decoded.id;   // Asegúrate de que `id` esté presente en el payload del token
        req.userRole = decoded.rol;  // Asegúrate de que `rol` esté presente en el payload del token
        
        next();
    });
};

module.exports = authMiddleware;
