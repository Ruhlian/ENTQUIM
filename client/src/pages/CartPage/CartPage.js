import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CartPage.css";
import Images from '../../utils/Images/Images'

const Cart = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const paymentOptionsRef = useRef(null);
  const [deliveryDetails] = useState({
    deliveryName: user?.nombre || "",
    deliveryAddress: user?.direccion || "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!user) {
      toast.warn("Debe registrarse para continuar", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setShowPaymentOptions(true);
    setTimeout(() => {
      paymentOptionsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Asegura que la vista de métodos de pago esté renderizada antes del scroll
  };
  
  const handlePaymentMethodChange = (e) => {
    const selectedMethod = e.target.value;
    setSelectedPaymentMethod(selectedMethod);
  
    // Asegurar que el área de métodos de pago permanezca abierta
    if (selectedMethod === "creditCard" || selectedMethod === "cashOnDelivery") {
      setShowPaymentOptions(true);
    }
  };
  

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/metodos-pago/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const methods = await response.json();
          setPaymentMethods(methods);
        } else {
          console.error("Error al obtener métodos de pago.");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const handleFinalizePurchase = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Por favor seleccione un método de pago", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
    const ventaData = {
      fecha: new Date().toISOString().split("T")[0], // Fecha en formato YYYY-MM-DD
      total: subtotal,
      estado: "pendiente", // Puedes ajustar el estado según la lógica de tu negocio
      metodo_pago: selectedPaymentMethod === "cashOnDelivery" ? "CONTRA_ENTREGA" : "TARJETA",
      id_metodo_pago: selectedPaymentMethod !== "cashOnDelivery" ? selectedPaymentMethod : null,
      correo: user?.correo || "", // Añade el correo del usuario logueado
      detalles: cartItems.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.quantity,
        precio_Unitario: item.precio,
      })),
    };
  
    try {
      const response = await fetch("http://localhost:3002/api/ventas/con-detalles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ventaData),
      });
  
      if (response.ok) {
        toast.success("Venta finalizada exitosamente", {
          position: "top-center",
          autoClose: 3000,
        });
        clearCart(); // Vacía el carrito después de finalizar la compra
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || "Error al finalizar la venta"}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error al finalizar la venta:", error);
      toast.error("Error al procesar la venta. Intente nuevamente.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="header-cart-container">
          <h2 className="cart-title">Tu Carrito</h2>
          <p>Precio unidades</p>
        </div>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío.</p>
            <a href="/productos" className="shop-btn">
              Ver productos
            </a>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id_producto} className="cart-item">
                  <div className="cart-item-info">
                    <div>
                      <img src={item.imagen} alt={item.nombre} className="cart-item-img"></img>
                      <div className="cart-item-description">
                        <div className="cart-item-description-container">
                          <h3>{item.nombre}</h3>
                          <p className="item-price">
                            COP {item.precio.toLocaleString('es-CO')}
                          </p>
                        </div>
                        <div className="quantity-container">
                          <div className="quantity-selector">
                            {item.quantity === 1 ? (
                              <button
                                className="quantity-btn delete-icon"
                                onClick={() => removeFromCart(item.id_producto)}
                              >
                                <img src={Images.icons.delete} alt="Eliminar" />
                              </button>
                            ) : (
                              <button
                                className="quantity-btn"
                                onClick={() => updateCartItemQuantity(item.id_producto, item.quantity - 1)}
                              >
                                -
                              </button>
                            )}

                            <span className="quantity-value">{item.quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => updateCartItemQuantity(item.id_producto, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="remove-link"
                            onClick={() => removeFromCart(item.id_producto)}
                          >
                            Eliminar del carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <p>COP {(item.precio * item.quantity).toLocaleString('es-CO')}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {showPaymentOptions && (
              <div className="payment-options" ref={paymentOptionsRef}>
                <div className="payment-options-options">
                  {paymentMethods.length > 0 ? (
                    <>
                      <h3>Selecciona un método de pago:</h3>
                      {paymentMethods.map((method) => (
                          <label key={method.id_metodo_pago}>
                            <input
                              type="radio"
                              value={method.id_metodo_pago}
                              checked={selectedPaymentMethod === String(method.id_metodo_pago)}
                              onChange={handlePaymentMethodChange}
                            />
                            **** {method.numero_tarjeta.slice(-4)} (Expira {method.mm_aa})
                          </label>
                        ))}

                      <div className="add-method-cart">
                        <Link to="/gestion-cuenta/pagos/nuevo-metodo">
                          Añadir Método de Pago
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="add-method-cart">
                      <Link to="/gestion-cuenta/pagos/nuevo-metodo">
                        Añadir Método de Pago
                      </Link>
                    </div>
                  )}
                  <label>
                    <input
                      type="radio"
                      value="cashOnDelivery"
                      checked={selectedPaymentMethod === "cashOnDelivery"}
                      onChange={handlePaymentMethodChange}
                    />
                    Contra entrega (Dirección: {deliveryDetails.deliveryAddress || "No disponible"})
                  </label>

                  <button className="finalize-btn" onClick={handleFinalizePurchase}>
                  Finalizar venta
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="cart-summary">
        <div>
        <p className="cart-summary-subtotal">
          Subtotal (items): COP {subtotal.toLocaleString('es-CO')}
        </p>
        <p>Envío: Gratis</p>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceder a pagar
        </button>
      </div>
    </div>
  );
};

export default Cart;
