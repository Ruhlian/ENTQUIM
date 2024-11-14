// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();
const MAX_TOASTS = 5; // Número máximo de notificaciones
const toastQueue = []; // Cola para manejar las notificaciones

const getStoredCartItems = () => JSON.parse(localStorage.getItem('cartItems')) || [];
const setStoredCartItems = (items) => localStorage.setItem('cartItems', JSON.stringify(items));

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getStoredCartItems());
    const [limitAlertShown, setLimitAlertShown] = useState(false); // Estado para controlar la alerta de límite

    useEffect(() => {
        setStoredCartItems(cartItems);
    }, [cartItems]);

    const showToast = (message, type) => {
        if (toastQueue.length < MAX_TOASTS) {
            toastQueue.push(message);
            toast[type](message, { autoClose: 1500, onClose: () => handleToastClose(message) });
        }
    };

    const handleToastClose = (message) => {
        const index = toastQueue.indexOf(message);
        if (index > -1) {
            toastQueue.splice(index, 1);
        }
    };

    const addToCart = (product, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id_producto === product.id_producto);
            const availableStock = product.stock; 
            const currentCartQuantity = existingItem ? existingItem.quantity : 0;

            if (currentCartQuantity + quantity <= availableStock) {
                const updatedItems = existingItem
                    ? prevItems.map(item => item.id_producto === product.id_producto ? { ...item, quantity: item.quantity + quantity } : item)
                    : [...prevItems, { ...product, quantity }];

                showToast(`${product.nombre} ${existingItem ? 'actualizado' : 'agregado'} en el carrito. Cantidad: ${currentCartQuantity + quantity}`, 'success');
                setLimitAlertShown(false); // Resetea el estado de alerta de límite
                return updatedItems;
            } else {
                if (!limitAlertShown) { // Verifica si la alerta ya se mostró
                    showToast(`No puedes agregar más de ${availableStock} unidades de ${product.nombre}.`, 'warn');
                    setLimitAlertShown(true); // Marca la alerta como mostrada
                }
                return prevItems;
            }
        });
    };

    const updateCartItemQuantity = (id_producto, quantity) => {
        setCartItems((prevItems) =>
            quantity > 0
                ? prevItems.map(item => item.id_producto === id_producto ? { ...item, quantity } : item)
                : prevItems.filter(item => item.id_producto !== id_producto) // Para eliminar el producto si quantity es 0 o negativo
        );
    };

    const removeFromCart = (id_producto) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id_producto !== id_producto));
        showToast('Producto eliminado del carrito.', 'info');
        setLimitAlertShown(false); // Resetea el estado de alerta de límite al eliminar un producto
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        showToast('Carrito vacío.', 'info');
        setLimitAlertShown(false); // Resetea el estado de alerta de límite al vaciar el carrito
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);