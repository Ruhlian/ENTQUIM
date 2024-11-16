import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CartPage.css";

const Cart = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expirationDate: "",
    cvv: "",
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryName: "",
    deliveryAddress: "",
  });
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardName: "",
    expirationDate: "",
    cvv: "",
    deliveryName: "",
    deliveryAddress: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

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
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const validateField = (name, value) => {
    let errorMessage = "";
    if (name === "cardNumber") {
      if (!/^\d{16}$/.test(value)) {
        errorMessage =
          "El número de la tarjeta solo puede contener números y debe tener 16 dígitos.";
      }
    } else if (name === "cardName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        errorMessage = "El nombre en la tarjeta solo puede contener letras y espacios.";
      }
    } else if (name === "expirationDate") {
      if (!/^\d{2}\/\d{2}$/.test(value)) {
        errorMessage = "La fecha de vencimiento debe estar en el formato MM/AA.";
      }
    } else if (name === "cvv") {
      if (!/^\d{3}$/.test(value)) {
        errorMessage = "El CVV debe contener exactamente 3 dígitos.";
      }
    } else if (name === "deliveryName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        errorMessage = "El nombre de entrega solo puede contener letras y espacios.";
      }
    } else if (name === "deliveryAddress") {
      if (!value) {
        errorMessage = "La dirección de entrega es requerida.";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    if (errorMessage) {
      setAlertMessage(errorMessage);
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedPaymentMethod === "creditCard") {
      setCreditCardDetails({ ...creditCardDetails, [name]: value });
    } else if (selectedPaymentMethod === "cashOnDelivery") {
      setDeliveryDetails({ ...deliveryDetails, [name]: value });
    }
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (selectedPaymentMethod === "creditCard") {
      Object.keys(creditCardDetails).forEach((field) =>
        validateField(field, creditCardDetails[field])
      );
    } else if (selectedPaymentMethod === "cashOnDelivery") {
      Object.keys(deliveryDetails).forEach((field) =>
        validateField(field, deliveryDetails[field])
      );
    }

    // Verifica si hay errores
    if (!Object.values(errors).every((error) => error === "")) {
      toast.error("Por favor, corrige los errores antes de continuar.", {
        position: "top-center",
        autoClose: 3000,
      });
      valid = false;
    }

    if (valid) {
      if (selectedPaymentMethod === "creditCard") {
        console.log("Datos de la tarjeta: ", creditCardDetails);
        toast.success("Pago realizado con éxito.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (selectedPaymentMethod === "cashOnDelivery") {
        console.log("Detalles de entrega: ", deliveryDetails);
        toast.success("Pedido realizado con éxito para entrega.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div>
      <h2 className="cart-title">Tu Carrito</h2>

      <div className="cart-container">
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
                      <h3>{item.nombre}</h3>
                      <p className="item-price">
                        COP {item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                      </p>
                      <div className="quantity-container">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateCartItemQuantity(item.id_producto, item.quantity - 1)
                              : null
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id_producto, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <p>Total: COP {(item.precio * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id_producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Resumen del pedido</h3>
              <p>Subtotal: COP {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
              <p>Envío: Gratis</p>
              <h3>Total: COP {subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</h3>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceder a pagar
              </button>
            </div>

            {showPaymentOptions && (
              <div className="payment-options">
                <div>
                  <label>
                    <input
                      type="radio"
                      value="creditCard"
                      checked={selectedPaymentMethod === "creditCard"}
                      onChange={handlePaymentMethodChange}
                    />
                    Tarjeta de crédito
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="cashOnDelivery"
                      checked={selectedPaymentMethod === "cashOnDelivery"}
                      onChange={handlePaymentMethodChange}
                    />
                    Contra entrega
                  </label>
                </div>

                {selectedPaymentMethod === "creditCard" && (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="cardNumber">Número de tarjeta</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={creditCardDetails.cardNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="cardName">Nombre en la tarjeta</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        placeholder="Nombre del titular"
                        value={creditCardDetails.cardName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="expirationDate">Fecha de vencimiento</label>
                      <input
                        type="text"
                        id="expirationDate"
                        name="expirationDate"
                        placeholder="MM/AA"
                        value={creditCardDetails.expirationDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="XXX"
                        value={creditCardDetails.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button type="submit">Realizar pago</button>
                  </form>
                )}

                {selectedPaymentMethod === "cashOnDelivery" && (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="deliveryName">Nombre de entrega</label>
                      <input
                        type="text"
                        id="deliveryName"
                        name="deliveryName"
                        placeholder="Nombre completo"
                        value={deliveryDetails.deliveryName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="deliveryAddress">Dirección de entrega</label>
                      <input
                        type="text"
                        id="deliveryAddress"
                        name="deliveryAddress"
                        placeholder="Dirección completa"
                        value={deliveryDetails.deliveryAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button type="submit">Confirmar entrega</button>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showAlert && <div className="alert">{alertMessage}</div>}
    </div>
  );
};

export default Cart;
