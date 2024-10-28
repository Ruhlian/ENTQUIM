import React, { useState } from "react";
import './Payment.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { Link } from 'react-router-dom';

const paths = [
  { name: 'Gestión de cuenta', link: '/gestion-cuenta' },
  { name: 'Pagos', link: '/mi-cuenta' }
];

const Payment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showActions, setShowActions] = useState(false);

  const paymentHistory = [
    { id: 1234, date: '22/10/2024', total: 45.00 },
    { id: 5678, date: '22/10/2024', total: 75.00 },
    { id: 9101, date: '20/10/2024', total: 60.00 },
  ];

  const filteredHistory = paymentHistory.filter(payment =>
    payment.id.toString().includes(searchTerm) ||
    payment.date.includes(searchTerm)
  );

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  return (
    <div className="account-payment">
      <Breadcrumbs paths={paths} />
      <div className="payment-container">
        <div className="payment-page">
          <div className="payment-header"></div>
          
          <div className="payment-methods">
            <h3>Métodos de pago</h3>
            <div className="methods-container">
              <div className="card-method">

              <div className="card-actions">
                  <button onClick={toggleActions}>Acciones ▼</button>
                  {showActions && (
                    <div className="actions-menu">
                      <button onClick={() => alert("Editar método")}>Editar</button>
                      <button onClick={() => alert("Eliminar método")}>Eliminar</button>
                    </div>
                  )}
                </div>
                
                <div className="card-type">
                  <p>Card type</p>
                </div>
                <div className="card-info">
                  <p>**** 1241 Expira 08/28</p>
                  <p>Joan Fontecha</p>
                </div>

              </div>
              <div className="add-method">
                <Link to="/gestion-cuenta/pagos/nuevo-metodo">Añadir Método de Pago</Link> {/* Enlace actualizado */}
              </div>
            </div>
          </div>

          <div className="payment-content">
            <h3>Historial de Compras</h3>
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Buscar por número de pedido o fecha" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>🔍</button>
            </div>
            <div className="payment-list">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((payment) => (
                  <div key={payment.id} className="payment-item">
                    Pedido #{payment.id} - Fecha: {payment.date} - Total: ${payment.total.toFixed(2)}
                  </div>
                ))
              ) : (
                <p>No se encontraron resultados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
