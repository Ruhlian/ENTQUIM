// CartModal.js
import React, { useState, useMemo } from 'react';
import './CartModal.css';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartModal = ({ isOpen, onClose }) => {
    const { cartItems = [], updateCartItemQuantity, removeFromCart, clearCart } = useCart() ?? {};
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            onClose();
        }, 200);
    };

    const handleQuantityChange = (id_producto, quantity) => {
        const item = cartItems.find(item => item.id_producto === id_producto);
        if (item) {
            if (quantity <= item.stock) {
                updateCartItemQuantity(id_producto, Math.max(1, quantity)); // Asegura que la cantidad no sea menor a 1
            } else {
                toast.warn(`No puedes establecer más de ${item.stock} unidades de ${item.nombre}.`, { autoClose: 1500 });
            }
        }
    };

    const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0), [cartItems]);
    const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

    const handleGoToCart = () => {
        navigate('/Carrito');
        handleClose();
    };

    const handleModalClick = (e) => e.stopPropagation();

    return (
        <div className={`modal ${isOpen ? 'show' : ''} ${isAnimating ? 'close-animation' : ''}`} onClick={handleClose}>
            <div className={`modal__content ${isAnimating ? 'close' : ''}`} onClick={handleModalClick}>
                <div className="cart__header">
                    <h3 className='cart__articles'>Artículos: {totalItems}</h3>
                    <button className="cart__clear" onClick={clearCart}>Vaciar Carrito</button>
                </div>
                {cartItems.length > 0 ? (
                    <>
                        <ul className="cart__list">
                            {cartItems.map((item) => (
                                <li key={item.id_producto} className="cart__item">
                                    <img src={item.imagen} alt={item.nombre} className="cart__image" />
                                    <div className="cart__details">
                                        <h3 className="cart__name">{item.nombre}</h3>
                                        <p className="cart-price">${item.precio.toFixed(3)}</p>
                                        <div className="cart__quantity">
                                            <label>Cantidad:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id_producto, Number(e.target.value))}
                                            />
                                        </div>
                                        <button className="cart__remove" onClick={() => removeFromCart(item.id_producto)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cart__subtotal">
                            <h3>Subtotal: ${subtotal.toFixed(3)}</h3>
                        </div>
                        <button
                            className="cart__checkout"
                            onClick={handleGoToCart}
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Ir a carrito'}
                        </button>
                    </>
                ) : (
                    <p>El carrito está vacío.</p>
                )}
            </div>
        </div>
    );
};

export default CartModal;