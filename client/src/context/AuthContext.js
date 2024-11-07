import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const showToast = useCallback((message, type) => {
        const currentTime = Date.now();
        if (!showToast.lastToast || currentTime - showToast.lastToast >= 5000) {
            showToast.lastToast = currentTime;
            switch (type) {
                case 'success':
                    toast.success(message, { autoClose: 1000 });
                    break;
                case 'error':
                    toast.error(message, { autoClose: 1000 });
                    break;
                case 'info':
                    toast.info(message, { autoClose: 1000 });
                    break;
                default:
                    break;
            }
        }
    }, []);

    useEffect(() => {
        const checkUserSession = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            console.log('checkUserSession:', { storedUser, token });

            if (storedUser && token) {
                try {
                    await AuthService.verifyToken(token);
                    console.log('Token verificado con éxito');
                    const parsedUser = JSON.parse(storedUser);
                    console.log('Usuario obtenido de localStorage:', parsedUser);
                    setUser(parsedUser);
                } catch (err) {
                    handleInvalidToken();
                }
            } else {
                console.log('No se encontró usuario o token en localStorage');
                setLoading(false);
            }
        };

        const handleInvalidToken = () => {
            console.log('Token inválido o expirado');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            showToast('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
            navigate('/Iniciar-Sesion');
        };

        checkUserSession();
    }, [navigate, showToast]);

    const handleLogin = async (correo, contrasena) => {
        setLoading(true);
        console.log('Iniciando sesión con:', { correo, contrasena });
        try {
            const data = await AuthService.login(correo, contrasena);
            if (data.user) {
                console.log('Inicio de sesión exitoso:', data.user);
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                showToast('Inicio de sesión exitoso!', 'success');
                navigate('/');
            } else {
                showToast('No se encontró el usuario en la respuesta.', 'error');
            }
        } catch (err) {
            console.error("Error en inicio de sesión:", err);
            showToast(err.message || 'Error al iniciar sesión. Verifica tus credenciales.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (nombre, apellido, correo, contrasena, fecha_nacimiento, telefono) => {
        setLoading(true);
        console.log('Registrando usuario con:', { nombre, apellido, correo, contrasena, fecha_nacimiento, telefono });
        try {
            const response = await AuthService.register(nombre, apellido, correo, contrasena, fecha_nacimiento, telefono);
            if (response && response.id_usuarios) {
                console.log('Registro exitoso:', response);
                showToast('Registro exitoso. Puedes iniciar sesión ahora.', 'success');
                navigate('/Iniciar-Sesion');
            } else {
                showToast('No se encontró el usuario en la respuesta.', 'error');
            }
        } catch (err) {
            console.error("Error en registro:", err);
            showToast('Error al registrar el usuario. Inténtalo de nuevo.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Cerrando sesión con token:', token);

        if (token) {
            try {
                await AuthService.invalidateToken(token);
                console.log('Token invalidado con éxito');
            } catch (err) {
                console.error("Error al invalidar el token:", err);
                showToast('Error al cerrar sesión. Inténtalo de nuevo.', 'error');
            }
        }

        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        console.log('Datos de usuario y token eliminados de localStorage');

        navigate('/Iniciar-Sesion');
        setLoading(false);
    };

    const updateUserInfo = async (updatedData) => {
        if (user && user.id_usuarios) {
            console.log('Actualizando usuario con datos:', { id_usuarios: user.id_usuarios, ...updatedData });
            try {
                const updatedUser = await AuthService.updateUser(user.id_usuarios, updatedData);
                console.log('Información de usuario actualizada en la respuesta:', updatedUser);
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                showToast('Información actualizada exitosamente.', 'success');
            } catch (error) {
                console.error('Error al actualizar la información del usuario:', error);
                showToast('No se pudo actualizar la información.', 'error');
            }
        } else {
            console.error('No se puede actualizar el usuario: id_usuarios no está definido.');
            showToast('Error: No se pudo identificar el usuario.', 'error');
        }
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout, handleRegister, updateUserInfo, loading }}>
            {children}
        </AuthContext.Provider>
    );
};