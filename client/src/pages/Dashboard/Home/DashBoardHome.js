import React, { useState, useEffect } from 'react';
import './Management.css';
import SideBarNav from '../../../componentes/Management/SideBarNav/SideBarNav';
import Navegation from '../../../componentes/Management/Navegation/Navegation';
import HeaderM from '../../../componentes/Management/Header/HeaderM';
import StockChart from '../../../componentes/Management/Charts/StockChart'; // Asegúrate de que el path es correcto
import axios from 'axios';

const Management = () => {
  // Estado para almacenar las ventas y los ingresos
  const [ventasData, setVentasData] = useState([]);
  const [ventasLabels, setVentasLabels] = useState([]);
  const [ingresosData, setIngresosData] = useState([]);
  
  // Estado para productos más vendidos
  const [products, setProducts] = useState([]);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    // Obtener datos de ventas
    axios.get('/api/ventas')
      .then((response) => {
        const { labels, data } = response.data;
        setVentasLabels(labels);
        setVentasData(data);
      })
      .catch((error) => {
        console.error('Error al obtener ventas:', error);
      });

    // Obtener datos de ingresos
    axios.get('/api/ingresos')
      .then((response) => {
        const { data } = response.data;
        setIngresosData(data);
      })
      .catch((error) => {
        console.error('Error al obtener ingresos:', error);
      });

    // Obtener productos más vendidos
    axios.get('/api/productos-mas-vendidos')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener productos más vendidos:', error);
      });
  }, []);

  return (
    <div className='management-home'>
      <HeaderM />
      <SideBarNav />
      <Navegation />
      <div className='main-management'>
        <h2 className='main-management-title'>Estadísticas</h2>

        <div className='management-home-charts__container-first'>
          <div className='management-home__solds-container'>
            <h4 className='home-chart-title'>Ventas</h4>
            <p className='home-chart-total'>{ventasData.reduce((acc, val) => acc + val, 0)}</p>
            <small className='home-chart-days'>Últimos 30 días</small>
            <div className='management-home-chart__container'>
              <StockChart labels={ventasLabels} dataPoints={ventasData} datasetLabel="Ventas" />
            </div>
          </div>

          <div className='management-home__solds-container'>
            <h4 className='home-chart-title'>Ingresos</h4>
            <p className='home-chart-total'>{ingresosData.reduce((acc, val) => acc + val, 0)}</p>
            <small className='home-chart-days'>Últimos 30 días</small>
            <div className='management-home-chart__container'>
              <StockChart labels={ventasLabels} dataPoints={ingresosData} datasetLabel="Ingresos" />
            </div>
          </div>

          <div className='management-home__solds-container'>
            <h4 className='home-chart-title'>Usuarios</h4>
            <p className='home-chart-total'>1.311</p>
            <small className='home-chart-days'>Últimos 30 días</small>
            <div className='management-home-chart__container'>
              <StockChart />
            </div>
          </div>
        </div>

        <div className='stock-home'>
          {/* Sección de productos más vendidos y stock */}
          <div className="best-sellers-stock-container">
            {/* Productos más vendidos */}
            <div className="best-sellers">
              <h4 className="best-sellers-title">Productos más vendidos</h4>
              <table className="best-sellers-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Unidades</th>
                    <th>Aumento</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.trend === 'up' ? (
                          <span className="trend-icon up">▲</span>
                        ) : (
                          <span className="trend-icon down">▼</span>
                        )}
                      </td>
                      <td>{product.nombre}</td>
                      <td>{product.unidades}</td>
                      <td>
                        <span
                          className={`increase ${
                            product.trend === 'up' ? 'positive' : 'negative'
                          }`}
                        >
                          {product.aumento > 0
                            ? `+${product.aumento}%`
                            : `${product.aumento}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <small className="best-sellers-days">Últimos 30 días</small>
            </div>

            {/* Contenedor de Stock con el gráfico */}
          </div>
          <div className="stock-chart-container">
              <h4 className="stock-chart-title">Stock</h4>
              <p className="stock-chart-total">221</p>
              <span className="stock-status">Disponible</span>
              <div className="stock-chart">
                <StockChart />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
