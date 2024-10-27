import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { validateCorreo, validateName, validateContrasena } from '../../utils/helpers';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link

const Login = () => {
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contrasenaVisible, setContrasenaVisible] = useState(false);
    const { handleLogin, handleRegister, user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/'); // Cambia '/' por la ruta a la que quieras redirigir
        }
    }, [user, navigate]);

    const toggleView = () => {
        setIsRegisterView(prev => !prev);
        setErrorMessage(''); // Limpia el mensaje de error al cambiar de vista
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
    
        // Validaciones
        if (!validateCorreo(correo)) {
            setErrorMessage('Por favor, ingresa un correo electrónico válido (mínimo 15 caracteres y máximo 35).');
            return;
        }
        if (!validateContrasena(contrasena)) {
            setErrorMessage('La contraseña debe tener entre 10 y 35 caracteres, con letras, números y al menos un símbolo.');
            return;
        }
    
        try {
            await handleLogin(correo, contrasena);
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage(error.message || 'Error al iniciar sesión. Verifica tus credenciales.'); // Usa el mensaje del error
        }
    };    

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpia el mensaje de error

        // Validaciones
        if (!validateName(name) || !validateName(lastName)) {
            setErrorMessage('El nombre y apellido solo pueden contener letras y tener como máximo 15 caracteres.');
            return;
        }
        if (!validateCorreo(correo)) {
            setErrorMessage('Por favor, ingresa un correo electrónico válido (mínimo 15 caracteres y máximo 35).');
            return;
        }
        if (!validateContrasena(contrasena)) {
            setErrorMessage('La contraseña debe tener entre 10 y 35 caracteres, con letras, números y al menos un símbolo.');
            return;
        }

        try {
            await handleRegister(name, lastName, correo, contrasena);
        } catch (error) {
            console.error('Registro fallido:', error);
            setErrorMessage('Error al registrar el usuario. Inténtalo de nuevo.');
        }
    };

    const handleContrasenaVisibility = () => {
        setContrasenaVisible(prev => !prev); // Alternar visibilidad
    };

    return (
        <main className="main">
            <div className={`contenedor__todo ${isRegisterView ? 'register-view' : ''}`}>
                <div className="caja__trasera">
                    <div className="caja__trasera_login">
                        <h3>¿Ya tienes una cuenta?</h3>
                        <p>Inicia sesión para entrar en la página</p>
                        <button id="btn__iniciar_sesion" onClick={toggleView}>Iniciar sesión</button>
                    </div>
                    <div className="caja__trasera_register">
                        <h3>¿Aún no tienes una cuenta?</h3>
                        <p>Regístrate para que puedas iniciar sesión</p>
                        <button id="btn__registrarse" onClick={toggleView}>Registrarse</button>
                    </div>
                </div>

                <div className="contenedor__login-register">
                    <form className={`formulario__login ${isRegisterView ? 'hidden' : ''}`} onSubmit={handleLoginSubmit}>
                        <h2>Iniciar sesión</h2>
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={correo}
                            onChange={(e) => {
                                if (e.target.value.length <= 35) { // Limitar a 35 caracteres
                                    setCorreo(e.target.value);
                                }
                            }}
                            required
                        />
                        <div className="password-container">
                            <input
                                type={contrasenaVisible ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) => {
                                    if (e.target.value.length <= 35) { // Limitar a 35 caracteres
                                        setContrasena(e.target.value);
                                    }
                                }}
                                required
                            />
                            <span className="password-icon" onClick={handleContrasenaVisibility}>
                                {contrasenaVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit">Entrar</button>
                        <p>
                            <Link to="/RecoverPassword">¿Olvidaste tu contraseña?</Link>
                        </p>
                    </form>

                    <form className={`formulario__register ${!isRegisterView ? 'hidden' : ''}`} onSubmit={handleRegisterSubmit}>
                        <h2>Registrarse</h2>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => {
                                if (e.target.value.length <= 15) { // Limitar a 15 caracteres
                                    setName(e.target.value);
                                }
                            }}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Apellido"
                            value={lastName}
                            onChange={(e) => {
                                if (e.target.value.length <= 15) { // Limitar a 15 caracteres
                                    setLastName(e.target.value);
                                }
                            }}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Correo"
                            value={correo}
                            onChange={(e) => {
                                if (e.target.value.length <= 35) { // Limitar a 35 caracteres
                                    setCorreo(e.target.value);
                                }
                            }}
                            required
                        />
                        <div className="password-container">
                            <input
                                type={contrasenaVisible ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) => {
                                    if (e.target.value.length <= 35) { // Limitar a 35 caracteres
                                        setContrasena(e.target.value);
                                    }
                                }}
                                required
                            />
                            <span className="password-icon" onClick={handleContrasenaVisibility}>
                                {contrasenaVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button type="submit">Registrarse</button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Login;
