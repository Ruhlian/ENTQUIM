import React, { useState } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import Images from '../../utils/Images/Images';
import AccountModal from '../Modals/AccountModal/AccountModal'; // Descomentar esta línea para importar AccountModal
import CartModal from '../Modals/CartModal/CartModal'

const Header = () => {
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
    const location = useLocation();
    const path = location.pathname;

    const closeModals = () => {
        setIsCartModalOpen(false);
        setIsAccountModalOpen(false);
    };

    const toggleCartModal = () => {
        setIsAnimating(true);
        if (isCartModalOpen) {
            setTimeout(() => {
                setIsCartModalOpen(false);
                setTimeout(() => {
                    setIsHeaderExpanded(false);
                    setIsAnimating(false);
                }, 100);
            }, 150);
        } else {
            closeModals(); // Cierra la otra modal si está abierta
            setIsHeaderExpanded(true);
            setTimeout(() => {
                setIsCartModalOpen(true);
                setIsAnimating(false);
            }, 50);
        }
    };

    const toggleAccountModal = () => {
        setIsAnimating(true);
        if (isAccountModalOpen) {
            setTimeout(() => {
                setIsAccountModalOpen(false);
                setTimeout(() => {
                    setIsHeaderExpanded(false);
                    setIsAnimating(false);
                }, 100);
            }, 150);
        } else {
            closeModals(); // Cierra la otra modal si está abierta
            setIsHeaderExpanded(true);
            setTimeout(() => {
                setIsAccountModalOpen(true);
                setIsAnimating(false);
            }, 50);
        }
    };

    const closeCartModal = () => {
        setIsCartModalOpen(false);
    };

    return (
        <header className="header">
            <div className="header__container">
                <div className='logo-header__container'>
                    <Link to={"/"}><img src={Images.logos.logo} alt="Logo" className="header__logo" /></Link>
                </div>

                <div className='navigation-header__container'>
                    <div className={`sections-header__container ${isHeaderExpanded ? 'expanded' : ''}`}>
                        <Link to={"/Nosotros"} className={path === "/Nosotros" ? "active" : ""}>NOSOTROS</Link>
                        <Link to={"/Productos"} className={path === "/Productos" ? "active" : ""}>PRODUCTOS</Link>
                        <Link to={"/Contacto"} className={path === "/Contacto" ? "active" : ""}>CONTÁCTENOS</Link>
                    </div>

                    <div className={`icons-header__container ${isHeaderExpanded ? 'expanded' : ''}`}>
                        <ul className="header__list">
                            <li className="header__element">
                                <img src={Images.icons.blackcart} alt="Carrito" className="cart" onClick={toggleCartModal} />
                            </li>
                            <li className="header__element">
                                <img src={Images.icons.blackaccount} alt='Cuenta' className='account' onClick={toggleAccountModal} />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Aquí descomentamos el AccountModal para hacerlo visible */}
            <AccountModal isOpen={isAccountModalOpen} onClose={toggleAccountModal} />
                        {/* Modal del carrito */}
                        <CartModal isOpen={isCartModalOpen} onClose={closeCartModal} />
        </header>
    );
}

export default Header;
