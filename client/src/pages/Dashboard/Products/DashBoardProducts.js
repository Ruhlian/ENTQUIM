import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importamos axios
import './ManagementP.css';
import HeaderM from '../../../componentes/Management/Header/HeaderM';
import SideBarNav from '../../../componentes/Management/SideBarNav/SideBarNav';
import Navegation from '../../../componentes/Management/Navegation/Navegation';
import filterIcon from '../../../assets/icons/filter.png';

const ManagementP = () => {
    const [productos, setProductos] = useState([]);  // Estado para almacenar todos los productos
    const [productosFiltrados, setProductosFiltrados] = useState([]);  // Productos para mostrar en la página actual
    const [paginaActual, setPaginaActual] = useState(1);  // Estado para la página actual
    const [productosPorPagina, setProductosPorPagina] = useState(10);  // Número de productos por página
    const [columnaOrden, setColumnaOrden] = useState(''); // Columna por la que se ordenará
    const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para controlar el orden (ascendente/descendente)
    const [filtroStock, setFiltroStock] = useState('');  // Estado para el filtro de stock

    // Llamada a la API para obtener los productos
    useEffect(() => {
        axios.get('http://localhost:3002/api/productos')  // Ajusta la URL según tu configuración
            .then((response) => {
                setProductos(response.data);  // Almacenamos los productos en el estado
            })
            .catch((error) => {
                console.error('Error al obtener los productos:', error);
            });
    }, []);

    // Función para acortar la descripción si es demasiado larga
    const acortarDescripcion = (descripcion) => {
        return descripcion.length > 50 ? descripcion.slice(0, 50) + '...' : descripcion;
    };

    // Función para ordenar los productos
    const ordenarProductos = (columna) => {
        const nuevaOrdenAscendente = columnaOrden === columna ? !ordenAscendente : true; // Alternar entre asc y desc si es la misma columna
        setColumnaOrden(columna);
        setOrdenAscendente(nuevaOrdenAscendente);
    };

    // Función para realizar la comparación y ordenar
    const ordenarPorColumna = (productos, columna, ascendente) => {
        return productos.sort((a, b) => {
            const valorA = a[columna];
            const valorB = b[columna];
            if (typeof valorA === 'string') {
                return ascendente
                    ? valorA.localeCompare(valorB)
                    : valorB.localeCompare(valorA);
            } else {
                return ascendente ? valorA - valorB : valorB - valorA;
            }
        });
    };

    // Función para obtener el estado del stock
    const obtenerEstadoStock = (stock) => {
        if (stock > 10) return 'Disponible';
        if (stock > 0 && stock <= 10) return 'Bajo';
        return 'No disponible';
    };

    // Filtrar productos según el filtro de stock y aplicar la ordenación
    useEffect(() => {
        const productosFiltradosPorStock = productos.filter((producto) => {
            const estadoStock = obtenerEstadoStock(producto.stock);
            return filtroStock ? estadoStock === filtroStock : true;  // Filtrar según el estado seleccionado
        });

        const indiceUltimoProducto = paginaActual * productosPorPagina;
        const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
        const productosOrdenados = ordenarPorColumna([...productosFiltradosPorStock], columnaOrden, ordenAscendente);
        setProductosFiltrados(productosOrdenados.slice(indicePrimerProducto, indiceUltimoProducto));
    }, [paginaActual, productosPorPagina, productos, columnaOrden, ordenAscendente, filtroStock]);

    // Manejar cambio de página
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    // Manejar cambio de productos por página
    const cambiarProductosPorPagina = (e) => {
        const cantidad = Number(e.target.value);
        setProductosPorPagina(cantidad > 0 ? cantidad : 10); // Mínimo 1 producto
        setPaginaActual(1); // Reiniciar a la primera página
    };

    // Manejar el cambio del filtro de stock
    const manejarFiltroStock = (estado) => {
        setFiltroStock(estado);
        setPaginaActual(1); 
    };

    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    return (
        <div className='management-products'>  
            <HeaderM />
            <SideBarNav />
            <Navegation />

            <div className='main-management-home'>
                <h2 className='main-management-home-title'>Productos</h2>

                <div className='management-products-container'>
                    {/* Filter section */}
                    <div className="filter-section">
                        <button className='register-user-button'>Añadir un nuevo producto</button>
                        <div className='filter-container'>
                            <img src={filterIcon} alt='' className='filter-icon'></img>
                            <h4 className='filter-title'>Filtrar</h4>
                        </div>

                        <div className="filter-options">
                            <h5 className='filter-status-title'>Stock</h5>
                            <div className="filter-status">
                                <ul>
                                    <li><input type="radio" name="stock" onChange={() => manejarFiltroStock('Disponible')} /> Disponible</li>
                                    <li><input type="radio" name="stock" onChange={() => manejarFiltroStock('Bajo')} /> Bajo</li>
                                    <li><input type="radio" name="stock" onChange={() => manejarFiltroStock('No disponible')} /> No disponible</li>
                                </ul>
                            </div>
                        </div>
                        {/* <div className="filter-options">
                            <h5 className='filter-status-title'>Categoria</h5>
                            <div className="filter-status">
                                <ul>
                                    <li><input type="radio" name="status" /> Insectos</li>
                                    <li><input type="radio" name="status" /> Roedores </li>
                                    <li><input type="radio" name="status" /> Murciélagos </li>
                                    <li><input type="radio" name="status" /> Larvas </li>
                                </ul>
                            </div>
                        </div> */}
                    </div>
                    
                    {/* Product table */}
                    <div className="sales-history products">
                        <table className="sales-history-table">
                            <thead>
                                <tr>
                                    <th onClick={() => ordenarProductos('id_producto')}>
                                        Id {columnaOrden === 'id_producto' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('nombre')}>
                                        Nombre {columnaOrden === 'nombre' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('descripcion')}>
                                        Descripción {columnaOrden === 'descripcion' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('precio')}>
                                        Precio {columnaOrden === 'precio' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => ordenarProductos('stock')}>
                                        Stock {columnaOrden === 'stock' && (ordenAscendente ? '↑' : '↓')}
                                    </th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mapeamos los productos filtrados según la página actual */}
                                {productosFiltrados.length > 0 ? productosFiltrados.map((producto) => (
                                    <tr key={producto.id_producto}>
                                        <td>{producto.id_producto}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{acortarDescripcion(producto.descripcion)}</td>
                                        <td>${producto.precio.toFixed(3)}</td>
                                        <td>{obtenerEstadoStock(producto.stock)}</td> {/* Mostramos el estado del stock */}
                                        <td><a href="#">Más detalles</a></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6">No se encontraron productos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <div className='pagination-input'>
                                <span>Mostrar los productos</span>
                                <input 
                                    placeholder={productosPorPagina} 
                                    className=''
                                    onChange={cambiarProductosPorPagina}  // Cambiar productos por página
                                />
                            </div>
                            <span>Mostrando del {(paginaActual - 1) * productosPorPagina + 1} al {Math.min(paginaActual * productosPorPagina, productos.length)} de {productos.length} productos</span>
                            <div className='pagination-button__container'>
                                <button 
                                    onClick={() => cambiarPagina(paginaActual - 1)} 
                                    disabled={paginaActual === 1}
                                >Anterior</button>
                                <div className='pagination-number'>
                                    {[...Array(totalPaginas).keys()].map(num => (
                                        <button 
                                            key={num + 1} 
                                            onClick={() => cambiarPagina(num + 1)}
                                            className={paginaActual === num + 1 ? 'active' : ''}
                                        >
                                            {num + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => cambiarPagina(paginaActual + 1)} 
                                    disabled={paginaActual === totalPaginas}
                                >Siguiente</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory control and stock section */}
                <div className="inventory-control">
                    <div className="inventory-history">
                        <h3 className='main-management-home-title'>Control de inventario</h3>

                        <div className="history-box">
                            <div className="date-selector__container">
                                <span className='history-box-title'>Historial de inventario</span>
                                <div>
                                    <input type='' placeholder='Hoy' className='date-selector'></input>
                                    <span className='history-box-date'>9/02/24</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="low-stock">
                        <h3 className='main-management-home-title'>Por agotarse</h3>
                        <div className="low-stock-box">
                            <div className="low-stock-header">
                                <span className='history-box-title'>Nombre</span>
                                <span className='history-box-title'>Unidades actuales</span>
                            </div>
                            <div className="total-stock">
                                <span className='history-box-title'>Stock total actual:</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagementP;