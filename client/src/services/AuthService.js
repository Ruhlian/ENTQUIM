import api from './Api';

const AuthService = {
    login: async (correo, contrasena) => {
        console.log('Intentando iniciar sesión con:', { correo, contrasena });

        // Validar campos requeridos
        if (!correo || !contrasena) {
            console.warn('Faltan campos requeridos:', { correo, contrasena });
            throw new Error('Por favor, ingrese todos los campos requeridos.');
        }

        try {
            const response = await api.post('/usuarios/login', { correo, contrasena });
            console.log('Respuesta del servidor:', response);

            // Verificar respuesta del servidor
            if (response.status === 200) {
                const { data } = response;
                console.log('Inicio de sesión exitoso, datos recibidos:', data);
                return data; // Asegúrate de que esto incluya 'user' y 'token'
            } else {
                if (response.status === 401) {
                    throw new Error('Correo o contraseña incorrectos.');
                }
                console.warn('Error en la respuesta del servidor, estado:', response.status);
                throw new Error('Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error.response ? error.response.data : error);
            throw AuthService.handleError(error, 'Error en el inicio de sesión');
        }
    },

    register: async (nombre, apellido, correo, contrasena) => {
        console.log('Registrando nuevo usuario:', { nombre, apellido, correo, contrasena });

        // Validar campos requeridos
        if (!nombre || !apellido || !correo || !contrasena) {
            throw new Error('Por favor, ingrese todos los campos requeridos.');
        }

        try {
            const response = await api.post('/usuarios/register', { nombre, apellido, correo, contrasena });
            console.log('Respuesta del servidor para registro:', response);

            if (response.status === 201) {
                const { data } = response;
                console.log('Registro exitoso, datos recibidos:', data);
                
                if (!data || !data.id_usuarios) {
                    throw new Error('No se encontró el usuario en la respuesta.');
                }

                return data; // Devolvemos los datos del usuario
            } else {
                throw new Error('Error en el registro');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            throw AuthService.handleError(error, 'Error en el registro');
        }
    },

    requestPasswordReset: async (correo) => {
        console.log('Solicitando restablecimiento de contraseña para:', { correo });

        if (!correo) {
            throw new Error('Por favor, ingrese el correo electrónico.');
        }

        try {
            const response = await api.post('/usuarios/request-password-reset', { correo });
            console.log('Respuesta del servidor para solicitud de restablecimiento:', response);

            if (response.status === 200) {
                if (response.data.message) {
                    return response.data.message;
                }
                return response.data;
            } else {
                throw new Error('Error en la solicitud de restablecimiento de contraseña');
            }
        } catch (error) {
            console.error('Error en la solicitud de restablecimiento de contraseña:', error);
            throw AuthService.handleError(error, 'Error en la solicitud de restablecimiento de contraseña');
        }
    },

    invalidateToken: async (token) => {
        console.log('Invalidando token:', token);

        if (!token) {
            throw new Error('Token no proporcionado.');
        }

        try {
            const response = await api.post('/usuarios/invalidate-token', { token });
            console.log('Respuesta del servidor al invalidar token:', response);

            if (response.status === 200) {
                return response.data; // Retorna cualquier dato necesario
            } else {
                throw new Error('Error al invalidar el token');
            }
        } catch (error) {
            console.error('Error al invalidar el token:', error);
            throw AuthService.handleError(error, 'Error al invalidar el token');
        }
    },

    handleError: (error, defaultMessage) => {
        if (error.response) {
            return new Error(error.response.data.message || defaultMessage);
        } else if (error.request) {
            return new Error('Error en la solicitud, intente nuevamente.');
        } else {
            return new Error('Error desconocido: ' + error.message);
        }
    },

    verifyToken: async (token) => {
        console.log('Verificando token:', token);

        if (!token) {
            throw new Error('Token no proporcionado.');
        }

        try {
            const response = await api.get('/usuarios/verify-token', { headers: { Authorization: `Bearer ${token}` } }); // Cambiado para incluir el token en los headers
            console.log('Token verificado con éxito:', response);
            return response.data; // Esto puede incluir información del usuario si es necesario
        } catch (error) {
            console.error('Error al verificar el token:', error);
            throw AuthService.handleError(error, 'Token inválido o expirado.');
        }
    },
};

export default AuthService;
