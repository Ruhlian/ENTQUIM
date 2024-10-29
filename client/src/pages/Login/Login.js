import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { validateCorreo, validateName, validateContrasena } from '../../utils/helpers';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [isRegisterView, setIsRegisterView] = useState(false);
    const [isAdditionalInfoView, setIsAdditionalInfoView] = useState(false);
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [contrasenaVisible, setContrasenaVisible] = useState(false);
    const { handleLogin, handleRegister, user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [correoError, setCorreoError] = useState('');
    const [contrasenaError, setContrasenaError] = useState('');
    const [nameError, setNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const toggleView = () => {
        setIsRegisterView(prev => !prev);
        setIsAdditionalInfoView(false);
        setErrorMessage('');
    };

    // Validación en tiempo real de cada campo
    const handleCorreoChange = (e) => {
        const value = e.target.value;
        setCorreo(value);
        if (!validateCorreo(value)) {
            setCorreoError('Correo inválido (mínimo 15 caracteres, máximo 35).');
        } else {
            setCorreoError('');
        }
    };

    const handleContrasenaChange = (e) => {
        const value = e.target.value;
        setContrasena(value);
        if (!validateContrasena(value)) {
            setContrasenaError('Contraseña inválida (entre 10 y 35 caracteres, con letras, números y un símbolo).');
        } else {
            setContrasenaError('');
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        if (!validateName(value)) {
            setNameError('Nombre inválido (solo letras, máximo 15 caracteres).');
        } else {
            setNameError('');
        }
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        if (!validateName(value)) {
            setLastNameError('Apellido inválido (solo letras, máximo 15 caracteres).');
        } else {
            setLastNameError('');
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (correoError || contrasenaError) return;

        try {
            await handleLogin(correo, contrasena);
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (nameError || lastNameError || correoError || contrasenaError) return;

        try {
            setIsAdditionalInfoView(true);
        } catch (error) {
            console.error('Registro fallido:', error);
            setErrorMessage('Error al registrar el usuario. Inténtalo de nuevo.');
        }
    };

    const handleAdditionalInfoSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            await handleRegister(name, lastName, correo, contrasena, birthDate, phone);
        } catch (error) {
            console.error('Registro fallido:', error);
            setErrorMessage('Error al registrar el usuario. Inténtalo de nuevo.');
        }
    };

    const handleContrasenaVisibility = () => {
        setContrasenaVisible(prev => !prev);
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
                    {!isAdditionalInfoView && (
                        <form className={`formulario__login ${isRegisterView ? 'hidden' : ''}`} onSubmit={handleLoginSubmit}>
                            <h2>Iniciar sesión</h2>
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                value={correo}
                                onChange={handleCorreoChange}
                                required
                            />
                            {correoError && <p className="error-message">{correoError}</p>}
                            <div className="password-container">
                                <input
                                    type={contrasenaVisible ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={handleContrasenaChange}
                                    required
                                />
                                <span className="password-icon" onClick={handleContrasenaVisibility}>
                                    {contrasenaVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </span>
                            </div>
                            {contrasenaError && <p className="error-message">{contrasenaError}</p>}
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit">Entrar</button>
                            <p>
                                <Link to="/RecoverPassword">¿Olvidaste tu contraseña?</Link>
                            </p>
                        </form>
                    )}

                    {!isAdditionalInfoView && (
                        <form className={`formulario__register ${!isRegisterView ? 'hidden' : ''}`} onSubmit={handleRegisterSubmit}>
                            <h2>Registrarse</h2>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={name}
                                onChange={handleNameChange}
                                required
                            />
                            {nameError && <p className="error-message">{nameError}</p>}
                            <input
                                type="text"
                                placeholder="Apellido"
                                value={lastName}
                                onChange={handleLastNameChange}
                                required
                            />
                            {lastNameError && <p className="error-message">{lastNameError}</p>}
                            <input
                                type="email"
                                placeholder="Correo"
                                value={correo}
                                onChange={handleCorreoChange}
                                required
                            />
                            {correoError && <p className="error-message">{correoError}</p>}
                            <div className="password-container">
                                <input
                                    type={contrasenaVisible ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={handleContrasenaChange}
                                    required
                                />
                                <span className="password-icon" onClick={handleContrasenaVisibility}>
                                    {contrasenaVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </span>
                            </div>
                            {contrasenaError && <p className="error-message">{contrasenaError}</p>}
                            <button type="submit">Continuar</button>
                        </form>
                    )}

                    {isAdditionalInfoView && (
                        <form className="formulario__register" onSubmit={handleAdditionalInfoSubmit}>
                            <h2>Información Adicional</h2>
                            <input
                                type="date"
                                placeholder="Fecha de Nacimiento"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Número de Teléfono"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button type="submit">Finalizar Registro</button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Login;
