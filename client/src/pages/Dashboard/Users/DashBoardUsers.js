import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManagementU.css';
import HeaderM from '../../../componentes/Management/Header/HeaderM';
import SideBarNav from '../../../componentes/Management/SideBarNav/SideBarNav';
import Navegation from '../../../componentes/Management/Navegation/Navegation';
import StockChart from '../../../componentes/Management/Charts/StockChart'; // Gráfico de stock
import filterIcon from '../../../assets/icons/filter.png'; 

const ManagementU = () => {
    const [usuarios, setUsuarios] = useState([]);

    // Obtener los usuarios desde la API
    useEffect(() => {
        axios.get('http://localhost:3002/api/usuarios')
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
            });
    }, []);

    return (
        <div className='users-management'>
            <HeaderM />
            <Navegation />
            <SideBarNav />
            <div className='main-management-home'>
                <h2 className='main-management-home-title'>Usuarios</h2>

                <div className='management-products-container'>
                    {/* Filter section */}
                    <div className="filter-section">
                        <button className='register-user-button'>Añadir un nuevo usuario</button>
                        <div className='filter-container'>
                            <img src={filterIcon} alt='' className='filter-icon'></img>
                            <h4 className='filter-title'>Filtrar</h4>
                        </div>

                        <div className="filter-options">
                            <h5 className='filter-status-title'>Rol</h5>
                            <div className="filter-status">
                                <ul>
                                    <li><input type="radio" name="rol" /> Administrador</li>
                                    <li><input type="radio" name="rol" /> Empleado</li>
                                    <li><input type="radio" name="rol" /> Usuario</li>
                                </ul>
                            </div>
                        </div>

                        <div className="filter-options">
                            <h5 className='filter-status-title'>Estado</h5>
                            <div className="filter-status">
                                <ul>
                                    <li><input type="radio" name="status" /> Activo</li>
                                    <li><input type="radio" name="status" /> Inactivo</li>
                                    <li><input type="radio" name="status" /> Bloqueado</li>
                                    <li><input type="radio" name="status" /> Por Eliminar</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de usuarios */}
                    <div className="sales-history products">
                        <table className="sales-history-table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id_usuarios}>
                                        <td>{usuario.id_usuarios}</td>
                                        <td>{usuario.nombre} {usuario.apellido}</td>
                                        <td>{usuario.correo}</td>
                                        <td>{usuario.id_rol === 1 ? 'Administrador' : usuario.id_rol === 2 ? 'Empleado' : 'Usuario'}</td>
                                        <td>{usuario.estado}</td>
                                        <td><a href="#">Más detalles </a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Contenedores de estadísticas */}
                <div className="statistics-users-container">
                    <div className="growth-users-rate">
                        <h3>Tasa de crecimiento</h3>
                        <StockChart /> {/* Gráfico de línea de crecimiento */}
                    </div>

                    <div className="stats-row statistics-users">
                        <div className="stat-card new-users">
                            <h4>Nuevos usuarios</h4>
                            <p className="stat-number">123</p>
                            <p className="stat-percentage">+25%</p>
                        </div>
                        <div className="stat-card page-time">
                            <h4>Tiempo en la página</h4>
                            <p className="stat-number">2m 39s</p>
                            <p className="stat-description">Promedio</p>
                        </div>
                    </div>

                    <div className="stats-row statistics-page">
                        <div className="stat-card active-users">
                            <h4>Usuarios más activos</h4>
                            <p className="stat-number">John Doe</p>
                            <p className="stat-description">15 visitas</p>
                        </div>
                        <div className="stat-card visited-products">
                            <h4>Productos más visitados</h4>
                            <p className="stat-number">1234</p>
                            <p className="stat-description">Visitas totales</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementU;
