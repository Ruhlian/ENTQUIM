import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './ChangePassword.css'; 
import { validateContrasena } from "../../utils/helpers"; 

const ChangePassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para manejar la visibilidad de la contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para confirmar la visibilidad de la contraseña

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('No se ha proporcionado un token válido.');
        }
    }, [location]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            const response = await AuthService.updatePassword(token, newPassword);
            console.log(response);
            setSuccess(true);
            setError('');
        } catch (err) {
            setError(err.message || 'Error al actualizar la contraseña.');
        }
    };

    const handlePasswordInputChange = (e) => {
        const value = e.target.value.slice(0, 35); // Limita a 35 caracteres
        setNewPassword(value);
        if (!validateContrasena(value)) {
            setPasswordError('Debe tener 8-35 caracteres, incluir letras, números y un símbolo.');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value.slice(0, 35); // Limita a 35 caracteres
        setConfirmPassword(value);
    };

    return (
        <div className="reset-password-container">
            <div className="card">
                <h2>Restablecer Contraseña</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">¡Contraseña actualizada con éxito!</div>}

                {!success && (
                    <form onSubmit={handlePasswordChange} className="form">
                        <div className="form-group">
                            <label htmlFor="newPassword">Nueva Contraseña</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Introduce tu nueva contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirma tu nueva contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Restablecer Contraseña
                        </button>
                    </form>
                )}

                <div className="back-link">
                    <button onClick={() => navigate('/Iniciar-Sesion')} className="btn btn-secondary">
                        Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
