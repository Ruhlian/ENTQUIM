import React, { useState } from "react";
import './AddMethodForm.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const paths = [
  { name: 'Gestión de cuenta', link: '/gestion-cuenta' },
  { name: 'Métodos de Pago', link: '/metodos-de-pago' },
  { name: 'Añadir Método de Pago', link: '/añadir-metodo' }
];

const AddMethodForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const handleSave = () => {
    // Lógica para guardar el método de pago
    alert("Método de pago guardado");
  };

  return (
    <div className="add-method-form">
      <Breadcrumbs paths={paths} />
      <form className="AddMethodPayment-fom">
        <h3>Añadir tarjeta de crédito o débito</h3>
        
        <div className="input-grid">
          <input
            type="text"
            placeholder="Número de la tarjeta"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="full-width"
          />

          <input
            type="text"
            placeholder="MM/AA"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="expiry"
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="cvc"
          />

          <input
            type="text"
            placeholder="Titular de la tarjeta"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="full-width"
          />

          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="full-width"
          />

          <input
            type="text"
            placeholder="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <p className="terms">
          Si continúas, confirmas que aceptas los <a href="/terms">Términos del Servicio</a> de ENGITUM.
        </p>

        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => alert("Cancelar")}>Cancelar</button>
          <button type="button" className="save-btn" onClick={handleSave}>Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default AddMethodForm;
