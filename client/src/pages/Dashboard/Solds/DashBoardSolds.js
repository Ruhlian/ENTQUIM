import React from 'react';
import './ManagementS.css';
import HeaderM from '../../../componentes/Management/Header/HeaderM';
import SideBarNav from '../../../componentes/Management/SideBarNav/SideBarNav';
import Navegation from '../../../componentes/Management/Navegation/Navegation';
import filterIcon from '../../../assets/icons/filter.png'; // Add the filter icon path
import StockChart from '../../../componentes/Management/Charts/StockChart';

const ManagementS = () => {
  return (
    <div className='management-home'>
      <HeaderM />
      <Navegation />
      <SideBarNav />
      <div className='main-management-home'>
        <h2 className='main-management-home-title'>Historial de Ventas</h2>
        
        <div className='management-solds-container'>
        {/* Filter section */}
        <div className="filter-section">
          <div className='filter-container'>
            <img src={filterIcon} alt='' className='filter-icon'></img>
            <h4 className='filter-title'>Filtrar</h4>
          </div>

          <div className="filter-options">
          <h5 className='filter-status-title'>Estado</h5>
            <div className="filter-status">
              <ul>
                <li><input type="radio" name="status" /> Aprobado</li>
                <li><input type="radio" name="status" /> Cancelado</li>
                <li><input type="radio" name="status" /> Pendiente</li>
                <li><input type="radio" name="status" /> En Proceso</li>
              </ul>
            </div>
          </div>

          <div className="filter-options">
            <div className="input-range">
              <h5 className='filter-status-title'>Total</h5>
                <div>
                  <input type="text" placeholder="Min" />
                    <span>-</span>
                  <input type="text" placeholder="Max" className='input-max'/>
                </div>
            </div>

            <div className="filter-status">
              <p>De $0 a $100.00</p>
            </div>
          </div>
    
        </div>
        
        {/* Table section */}
        <div className="sales-history solds">
  <table className="sales-history-table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Total</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Oct 7, 2024</td>
        <td>John Doe</td>
        <td>$100</td>
        <td><span className="status approved">Aceptada</span></td>
        <td><a href="#">Más detalles </a></td>
      </tr>
    </tbody>
  </table>
  <div className="pagination">
    <div className='pagination-input'>
      <span>Mostrar las ventas</span>
      <input placeholder='10'></input>
    </div>
    <span>Mostrando del 1 al 10 de 50 ventas</span>
    <div className='pagination-button__container'>
      <button>Anterior</button>
      <div className='pagination-number'>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      </div>
      <button>Siguiente</button>
    </div>
  </div>
</div>
</div>


        {/* Statistics section */}
        <div className="statistics-section">
          <h3 className='main-management-home-title'>Estadísticas</h3>

          <div className="statistics-container">
            <div className="statistics-solds-card">
              <h4>Ventas</h4>
              <span className="statistics-value">1231</span>
              <StockChart />
            </div>


            <div className="statistics-comparison">
              <h3 className='main-management-home-title'>Comparar</h3>
              
              <div className='statistics-comparision__container'>
              <div className="statistics-box">
                <h5>Septiembre 09/2024</h5>
                <p>1239</p>
                <span>Promedio por día</span>
                <p>24</p>
              </div>

              <div className="statistics-box">
                <h5>Octubre 10/2024</h5>
                <p>1321</p>
                <span>Promedio por día</span>
                <p>24</p>
              </div>
              </div>

              <div className="growth-info">
              <p>Crecimiento de <span className="growth-positive">+2%</span> respecto a septiembre.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementS;
