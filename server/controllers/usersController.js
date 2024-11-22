const connection = require('../config/conexion');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenService = require('../models/tokens'); // Asegúrate de importar el servicio de token
const transporter = require('../config/nodemailer'); // Importa el transporter configurado

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
    const query = 'SELECT * FROM Usuarios';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos.' });
        }
        res.json(results);
    });
};

// Iniciar sesión
const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Por favor, ingrese todos los campos requeridos.' });
    }

    const query = 'SELECT * FROM Usuarios WHERE correo = ?';

    connection.query(query, [correo], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const user = results[0];
        console.log(user); // Agrega esta línea para depurar

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        // Generar un token que expire en 1 hora
        const token = jwt.sign(
            { id: user.id_usuarios, correo: user.correo, rol: user.id_rol }, // Agregar correo aquí
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );        
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expira en 1 hora

        try {
            await tokenService.insertToken(user.id_usuarios, token, expiresAt);
        } catch (error) {
            return res.status(500).json({ error: 'Error al guardar el token en la base de datos.' });
        }

        res.json({
            token,
            user: {
                id: user.id_usuarios,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                fecha_nacimiento: user.fecha_nacimiento,
                telefono: user.telefono,
                direccion: user.direccion,
                rol: user.id_rol,
            },
            message: 'Login exitoso',
        });
    });
};

// Verificar token del usuario para sus datos
const verifyToken = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtiene el token del encabezado
    
    if (!token) {
        return res.status(400).json({ error: 'Token requerido.' });
    }

    try {
        const tokenData = await tokenService.verifyToken(token);
        if (!tokenData) {
            return res.status(401).json({ error: 'Token no válido o expirado.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token no válido.' });
            }

            const userId = decoded.id;

            // Obtiene los datos del usuario desde la base de datos
            const query = 'SELECT * FROM Usuarios WHERE id_usuarios = ?';
            connection.query(query, [userId], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Error en la base de datos.' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado.' });
                }

                res.json({
                    message: 'Token válido.',
                    user: results[0], // Devuelve los datos del usuario
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error al verificar el token.' });
    }
};

// Registrar un nuevo usuario
const register = async (req, res) => {
    const { nombre, apellido, correo, contrasena, id_rol, fecha_nacimiento, telefono, direccion } = req.body;
    const defaultRoleId = 3; 
    const roleId = id_rol || defaultRoleId;

    if (!nombre || !apellido || !correo || !contrasena || !fecha_nacimiento || !telefono) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
    }

    try {
        const [existingUser] = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Usuarios WHERE correo = ?';
            connection.query(query, [correo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (existingUser) {
            return res.status(409).json({ error: 'El correo ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const { insertId } = await new Promise((resolve, reject) => {
            const query = `
                    INSERT INTO Usuarios (correo, contrasena, nombre, apellido, id_rol, fecha_nacimiento, telefono, direccion) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

            connection.query(query, [correo, hashedPassword, nombre, apellido, roleId, fecha_nacimiento, telefono, direccion || null], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        res.status(201).json({ id_usuarios: insertId, correo, nombre, apellido, id_rol: roleId, fecha_nacimiento, telefono, direccion });
    } catch (err) {
        res.status(500).json({ error: 'Error en la base de datos.' });
    }
};

// Eliminar un usuario por ID
const deleteUserById = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM Usuarios WHERE id_usuarios = ?'; 

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos.', details: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    });
};

// Cambiar el rol de un usuario
const changeUserRole = async (req, res) => {
    const { id } = req.params; 
    const { id_rol } = req.body;

    const query = 'UPDATE Usuarios SET id_rol = ? WHERE id_usuarios = ?';

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [id_rol, id], (err, results) => {
                if (err) {
                    console.error('Error al cambiar el rol del usuario:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });

        if (results.affectedRows === 0) {
            console.warn(`No se encontró usuario para cambiar el rol con ID: ${id}`);
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        console.log(`Rol del usuario con ID ${id} cambiado a ${id_rol}.`);
        res.json({ message: `Rol del usuario con ID ${id} cambiado a ${id_rol}.` });
    } catch (err) {
        console.error('Error al cambiar el rol del usuario:', err);
        return res.status(500).json({ error: 'Error en la base de datos.' });
    }
};

// Cerrar sesión
const logout = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.status(400).json({ error: 'Token requerido para cerrar sesión.' });
    }

    try {
        await tokenService.deleteToken(token); // Eliminar el token de la base de datos
        res.json({ message: 'Sesión cerrada exitosamente.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al cerrar sesión.' });
    }
};

// Elimina un token por id
const deleteTokenById = async (req, res) => {
    const { id } = req.params; // Obtener el ID del token desde los parámetros de la ruta

    try {
        const result = await tokenService.deleteTokenById(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Token no encontrado.' });
        }

        res.json({ message: 'Token eliminado exitosamente.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el token.' });
    }
};

// Invalida el token al cerrar sesión
const invalidateToken = async (req, res) => {
    const token = req.body.token; // Asegúrate de que el token esté presente en el cuerpo de la solicitud

    if (!token) {
        return res.status(400).json({ error: 'Token requerido.' });
    }

    try {
        const result = await tokenService.invalidateToken(token); // Invalida el token en la base de datos

        if (!result) {
            return res.status(404).json({ error: 'Token no encontrado.' });
        }

        res.json({ message: 'Token invalidado exitosamente.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al invalidar el token.' });
    }
};

// Verifica la contraseña del usuario
const verifyPassword = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;
  
    const query = 'SELECT contrasena FROM Usuarios WHERE id_usuarios = ?';
    connection.query(query, [userId], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error en la base de datos.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.contrasena);
  
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta.' });
      }
  
      res.json({ message: 'Contraseña verificada correctamente.' });
    });
  };

// Actualizar información de un usuario autenticado
const updateUser = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario desde el token decodificado
    const { nombre, apellido, correo, fecha_nacimiento, telefono, direccion } = req.body;

    // Construir los campos para actualizar dinámicamente
    let fieldsToUpdate = [];
    let values = [];

    if (nombre) {
        fieldsToUpdate.push("nombre = ?");
        values.push(nombre);
    }
    if (apellido) {
        fieldsToUpdate.push("apellido = ?");
        values.push(apellido);
    }
    if (correo) {
        fieldsToUpdate.push("correo = ?");
        values.push(correo);
    }
    if (fecha_nacimiento) {
        fieldsToUpdate.push("fecha_nacimiento = ?");
        values.push(fecha_nacimiento);
    }
    if (telefono) {
        fieldsToUpdate.push("telefono = ?");
        values.push(telefono);
    }
    if (direccion) {
        fieldsToUpdate.push("direccion = ?");
        values.push(direccion)
    }
    
    // Verificar si hay campos para actualizar
    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: 'No se enviaron campos para actualizar.' });
    }

    // Añadir el userId al final de los valores
    values.push(userId);

    // Crear la consulta con los campos dinámicos
    const query = `UPDATE Usuarios SET ${fieldsToUpdate.join(", ")} WHERE id_usuarios = ?`;

    try {
        // Ejecutar la consulta en la base de datos
        const results = await new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Información actualizada exitosamente.' });
    } catch (err) {
        console.error('Error al actualizar la información del usuario:', err);
        res.status(500).json({ error: 'Error en la base de datos.' });
    }
};
// Mapa para rastrear los tiempos de envío de correos (en memoria)
const emailCooldown = new Map();

const requestPasswordChange = async (req, res) => {
    const { correo } = req.body;

    // Validar que el correo esté presente
    if (!correo) {
        return res.status(400).json({ error: 'Por favor, ingrese un correo electrónico válido.' });
    }

    // Verificar si el correo está en cooldown
    const currentTime = Date.now();
    const cooldownTime = 30 * 1000; // 30 segundos en milisegundos
    if (emailCooldown.has(correo)) {
        const lastSentTime = emailCooldown.get(correo);
        if (currentTime - lastSentTime < cooldownTime) {
            return res.status(429).json({ error: 'Espera 30 segundos antes de solicitar otro correo.' });
        }
    }

    // Verificar si el correo existe en la base de datos
    const query = 'SELECT * FROM Usuarios WHERE correo = ?';

    connection.query(query, [correo], async (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ error: 'Hubo un problema al verificar el correo. Intenta nuevamente más tarde.' });
        }

        // Si no se encuentra el correo
        if (results.length === 0) {
            return res.status(404).json({ error: 'El correo electrónico no está registrado en nuestro sistema.' });
        }

        const user = results[0];

        // Generar un token JWT para restablecer la contraseña
        const resetToken = jwt.sign(
            { userId: user.id_usuarios }, // Datos que quieres incluir en el payload
            process.env.JWT_SECRET, // La clave secreta
            { expiresIn: '15m' } // El token será válido por 15 minutos
        );

        // Crear el enlace para el restablecimiento de contraseña con el token JWT
        const resetLink = `${process.env.FRONTEND_URL}/actualizar-contraseña?token=${resetToken}`;

        // Configurar los detalles del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Solicitud de cambio de contraseña',
            html: `
                <p>Hola ${user.nombre},</p>

                <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente enlace para crear una nueva contraseña:</p>

                <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablece tu contraseña</a></p>

                <p>Si no solicitaste este cambio, puedes ignorar este correo, y tu contraseña permanecerá igual.</p>

                <p>¡Gracias por confiar en nosotros!</p>
            `
        };

        try {
            // Enviar el correo de restablecimiento
            await transporter.sendMail(mailOptions);
            console.log(`Correo de restablecimiento enviado a: ${correo}`);

            // Insertar el token en la base de datos
            const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // Token válido por 15 minutos
            const insertQuery = 'INSERT INTO tokens_usuarios (id_usuarios, token, expires_at) VALUES (?, ?, ?)';
            connection.query(insertQuery, [user.id_usuarios, resetToken, expirationTime], (err, result) => {
                if (err) {
                    console.error('Error al insertar el token en la base de datos:', err);
                    return res.status(500).json({ error: 'Hubo un problema al almacenar el token en la base de datos.' });
                }

                // Actualizar el tiempo del último envío
                emailCooldown.set(correo, currentTime);

                // Responder si el correo fue enviado con éxito
                return res.json({ message: 'Hemos enviado un enlace de restablecimiento a tu correo electrónico. Revisa tu bandeja de entrada.' });
            });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ error: 'Hubo un error al enviar el correo de restablecimiento. Intenta nuevamente más tarde.' });
        }
    });
};

// Actualziar contraseña
const updatePassword = async (req, res) => {
    // Verificamos el cuerpo de la solicitud para depuración
    console.log('Cuerpo de la solicitud recibido en el backend:', req.body);

    const { token, nuevaContrasena } = req.body;

    // Validaciones
    if (!token || !nuevaContrasena) {
        return res.status(400).json({ error: 'Por favor, ingrese un token válido y una nueva contraseña.' });
    }

    try {
        // 1. Verificar el token
        const tokenData = await tokenService.getTokenData(token);
        console.log('Datos del token decodificados:', tokenData); // Log para ver los datos decodificados del token

        if (!tokenData) {
            return res.status(400).json({ error: 'Token mal formado o inválido.' });
        }

        if (new Date(tokenData.expiresAt) < new Date()) {
            return res.status(400).json({ error: 'Token expirado.' });
        }

        // 2. Obtener los datos del usuario asociado al token
        const query = 'SELECT * FROM Usuarios WHERE id_usuarios = ?';
        
        // Usando Promesas en lugar de callbacks
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [tokenData.userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log('Datos obtenidos de la base de datos para el usuario:', results); // Log para ver los resultados de la base de datos

        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontró el usuario con el id proporcionado.' });
        }

        const user = results[0];

        // 3. Encriptar la nueva contraseña
        const hashedPassword = bcrypt.hashSync(nuevaContrasena, 10);
        console.log('Contraseña encriptada:', hashedPassword);  // Log para ver la contraseña encriptada

        // 4. Actualizar la contraseña del usuario en la base de datos
        const updateQuery = 'UPDATE Usuarios SET contrasena = ? WHERE id_usuarios = ?';
        
        const updateResults = await new Promise((resolve, reject) => {
            connection.query(updateQuery, [hashedPassword, user.id_usuarios], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log('Resultados de la actualización de la contraseña:', updateResults); // Log para ver los resultados de la actualización

        if (updateResults.affectedRows === 0) {
            return res.status(400).json({ error: 'No se pudo actualizar la contraseña.' });
        }

        // 5. Eliminar el token después de usarlo
        try {
            await tokenService.deleteToken(token);
            console.log('Token eliminado exitosamente'); // Log para verificar que el token se eliminó correctamente
        } catch (error) {
            console.error('Error al eliminar el token:', error);
            return res.status(500).json({ error: 'Hubo un problema al eliminar el token.' });
        }

        // 6. Responder éxito
        return res.json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        console.error('Error al procesar la solicitud de cambio de contraseña:', error);
        return res.status(500).json({ error: 'Hubo un problema al procesar la solicitud de cambio de contraseña.' });
    }
};

// Exportar las funciones del controlador
module.exports = {
    getAllUsers,
    login,
    register,
    login,
    deleteUserById,
    changeUserRole,
    logout,
    invalidateToken,
    verifyToken,
    deleteTokenById,
    updateUser, 
    verifyPassword,
    requestPasswordChange,
    updatePassword
};
