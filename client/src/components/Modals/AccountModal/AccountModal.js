import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 
import { toast } from 'react-toastify'; 
import './AccountModal.css';
import Images from '../../../utils/Images/Images';

const AccountModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user, handleLogout } = useAuth(); // Usa handleLogout del contexto

    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogoutClick = () => {
        console.log('Cerrando sesión desde el modal');
        handleLogout(); // Llama a la función de logout del contexto
        toast.info('Has cerrado sesión exitosamente.', {
            autoClose: 1000, // Duración de la alerta en milisegundos
            pauseOnHover: false, // Evita que la alerta se pause al pasar el ratón
            draggable: false, // Evita que se pueda arrastrar la alerta
        }); 
        onClose(); // Cierra el modal
    };

    const handleManageAccount = () => {
        onClose();
        navigate('/gestion-cuenta');
    };

    return (
        <div className={`account-modal ${isOpen ? 'show' : ''}`}>
            <div className="account-modal__content">
                {isAuthenticated ? (
                    <>
                        <h2 className="welcome-account">Bienvenido, {user?.nombre || 'Usuario'}</h2>
                        <p className="account-mail">{user?.correo || 'No disponible'}</p>
                        <div className="account-management">
                            <div className="management">
                            <button className="manage-button" onClick={handleManageAccount}>
                                Ir a Gestionar Cuenta
                            </button>
                            </div>
                            
                            <div className='modal-logout-container'>
                            <button className="logout-button" onClick={handleLogoutClick}>
                                Cerrar sesión
                                <img src={Images.icons.redlogout}
                                     className='modal-logout-button'
                                     alt=''
                                     title=''
                                ></img>
                            </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='login-prompt-container'>
                        <h2 className="login-prompt">¡No has iniciado sesión!</h2>
                        <p>Inicia sesión o Registrate para hacer tu compra.</p>
                        <button className="login-button-modal" onClick={() => {
                            onClose();
                            navigate('/Iniciar-Sesion');
                        }}>
                            Iniciar sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountModal;
