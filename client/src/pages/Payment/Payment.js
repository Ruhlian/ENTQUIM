import React, { useState, useEffect } from "react";
import './Payment.css';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const paths = [
  { name: 'Gestión de cuenta', link: '/gestion-cuenta' },
  { name: 'Pagos', link: '/mi-cuenta' }
];

const Payment = () => {
  const { user } = useAuth(); // Obtener el usuario logueado del contexto de autenticación
  const [searchTerm, setSearchTerm] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]); // Estado para métodos de pago

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

  // Función para obtener los métodos de pago del usuario logueado
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/metodos-pago/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
    
        // Verificar si la respuesta es JSON
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          const methods = await response.json();
          setPaymentMethods(methods);
        } else {
          // Imprimir el texto completo de la respuesta para entender el error
          const errorText = await response.text();
          console.error("Error al obtener métodos de pago:", errorText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    

    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  return (
    <div className="account-payment">
      <Breadcrumbs paths={paths} />
      <div className="payment-container">
        <div className="payment-page">
          <div className="payment-header"></div>

          <div className="payment-methods">
            <h3 className="payment-methods-title">Métodos de pago</h3>
            <div className="methods-container">
              {paymentMethods.map((method) => (
                <div key={method.id_metodo_pago} className="card-method">
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
                    <p>{method.tipo_tarjeta || "Tarjeta de crédito"}</p>
                  </div>
                  <div className="card-info">
                    <p>**** {method.numero_tarjeta.slice(-4)} Expira {method.mm_aa}</p>
                    <p>{method.nombre_titular}</p>
                  </div>
                </div>
              ))}
              <div className="add-method">
                <Link to="/gestion-cuenta/pagos/nuevo-metodo">Añadir Método de Pago</Link>
              </div>
            </div>
          </div>

          <div className="payment-content">
            <h3 className="payment-methods-title">Historial de Compras</h3>
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
