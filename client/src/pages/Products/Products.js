import React, { useEffect, useState } from 'react';
import './Products.css';
import { Link } from 'react-router-dom';

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');


    useEffect(() => {
        fetch('http://localhost:3001/productos')
            .then((response) => response.json())
            .then((data) => {
                setProductos(data); 
                setIsLoading(false); 
            })
            .catch((error) => {
                console.error('Error fetching productos:', error);
                setIsLoading(false);
            });
    }, []);

    const productosFiltrados = productos.filter((producto) => {
        if (categoriaSeleccionada === 'Otros') {
            return producto.categoria !== 'Insectos' && producto.categoria !== 'Roedores';
        }
        return producto.categoria === categoriaSeleccionada || categoriaSeleccionada === '';
    });

    const productosMostrados = categoriaSeleccionada === '' ? productos.slice(0, 5) : productosFiltrados;

    const categoriaTitulo = categoriaSeleccionada || 'Productos';

    return (
        <>

            <div className="product-image__container">
                <div className="product-image-titles__container">
                    <h2 className="product-image-title">PRODUCTOS</h2>
                    <h3 className="product-image-subtitle">Calidad y seguridad en cada producto.</h3>
                </div>
            </div>

            <div className='product-main__container'>
                <div className='products-main__container'>
                    <h2 className='products-main__title'>{categoriaTitulo}</h2>

                    <div className='products-container'>
                        {isLoading ? (
                            <p>Cargando productos...</p>
                        ) : productosMostrados.length > 0 ? (
                            productosMostrados.map((producto) => (
                                <div className='products-container__container' key={producto.id}>
                                    <Link to={`/ProductDetails/${producto.id}`}>
                                        <img 
                                            src={`http://localhost:3001${producto.imagen}`} 
                                            alt={producto.nombre} 
                                            className='product-container__image'
                                        />
                                    </Link>
                                    <h4 className='product-container__title'>{producto.nombre}</h4>
                                    <p className='product-container__price'>${producto.precio.toFixed(3)} COP</p>
                                    <button 
                                        className='product-container__add-product'
                                    >
                                        Añadir al carrito
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No hay productos disponibles en esta categoría.</p>
                        )}
                    </div>
                    <div className='product__all-products'>
                        <Link to="/Productos/Todos">Ver todos{" >"}</Link>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Products;
