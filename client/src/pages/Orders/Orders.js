import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./Orders.css";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const paths = [
    { name: "Gestión de cuenta", link: "/gestion-cuenta" },
    { name: "Órdenes", link: "/mis-ordenes" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3002/api/ventas/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      } catch (err) {
        console.error("Error al obtener las órdenes:", err);
        setError("Hubo un problema al cargar las órdenes.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <div className="orders-page">Cargando órdenes...</div>;
  }

  if (error) {
    return <div className="orders-page error-message">{error}</div>;
  }

  return (
    <div className="orders-page">
      <Breadcrumbs paths={paths} />
      <h1>Mis Órdenes</h1>
      {orders.length === 0 ? (
        <p>No tienes órdenes actualmente.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id_venta}>
              <h3>Orden #{order.id_venta}</h3>
              <p>Fecha: {order.fecha}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p>Estado: {order.estado}</p>
              <a
                href="#!"
                onClick={() => openModal(order)}
                className="details-link"
              >
                Ver detalles
              </a>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles de la Orden #{selectedOrder.id_venta}</h2>
            <p><strong>Correo:</strong> {selectedOrder.correo}</p>
            <p><strong>Método de Pago:</strong> 
              {selectedOrder.detalles[0]?.metodo_pago === "TARJETA" ? (
                <>
                  Tarjeta 
                  {typeof selectedOrder.detalles[0]?.id_metodo_pago === "string"
                    ? ` ****${selectedOrder.detalles[0]?.id_metodo_pago.slice(-4)}`
                    : ""}
                  {selectedOrder.detalles[0]?.mm_aa 
                    ? ` (Expira ${selectedOrder.detalles[0]?.mm_aa})`
                    : ""}
                </>
              ) : (
                "Contra entrega"
              )}
            </p>
          
            <ul>
              {selectedOrder.detalles.map((detalle, index) => (
                <li key={index}>
                  Producto #{detalle.id_producto} - Cantidad: {detalle.cantidad}, Precio Unitario: ${detalle.precio_Unitario.toFixed(2)}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="close-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
