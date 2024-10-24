import React, { useEffect, useState } from 'react';
import './AllProducts.css';
import { Link } from 'react-router-dom';

const AllProducts = () => {
    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [preciosSeleccionados, setPreciosSeleccionados] = useState([]);
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

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

    const handleCategoriaChange = (categoria) => {
        setCategoriasSeleccionadas((prev) => {
            if (prev.includes(categoria)) {
                return prev.filter((c) => c !== categoria);
            } else {
                return [...prev, categoria];
            }
        });
    };

    const handlePrecioChange = (rango) => {
        setPreciosSeleccionados((prev) => {
            if (prev.includes(rango)) {
                return prev.filter((p) => p !== rango);
            } else {
                return [...prev, rango];
            }
        });
    };

    const productosFiltrados = productos.filter((producto) => {
        if (categoriasSeleccionadas.length > 0) {
            return categoriasSeleccionadas.includes(producto.categoria);
        }
        return true;
    }).filter((producto) => {
        if (preciosSeleccionados.length > 0) {
            return preciosSeleccionados.some((rango) => {
                if (rango === 'bajo') return producto.precio < 33;
                if (rango === 'medio') return producto.precio >= 33 && producto.precio <= 66;
                if (rango === 'alto') return producto.precio > 66;
                return false;
            });
        }
        const minPrice = precioMin !== '' ? parseFloat(precioMin) : 0;
        const maxPrice = precioMax !== '' ? parseFloat(precioMax) : Infinity;
        return producto.precio >= minPrice && producto.precio <= maxPrice;
    });

    return (
        <>

            <div className="allproducts-page">
                <div className="allproducts-filter__container">
                    <h3 className="allproducts-filter__title">Filtrar</h3>

                    <div className="allproducts-category__filter">
                        <h4>Categoria</h4>
                        <div className="allproducts-category__item">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={categoriasSeleccionadas.includes('Insectos')}
                                    onChange={() => handleCategoriaChange('Insectos')}
                                />
                                <span> Insectos</span>
                            </label>
                        </div>

                        <div className="allproducts-category__item">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={categoriasSeleccionadas.includes('Roedores')}
                                    onChange={() => handleCategoriaChange('Roedores')}
                                />
                                <span> Roedores</span>
                            </label>
                        </div>

                        <div className="allproducts-category__item">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={categoriasSeleccionadas.includes('Otros')}
                                    onChange={() => handleCategoriaChange('Otros')}
                                />
                                <span> Otros</span>
                            </label>
                        </div>
                    </div>

                    <div className="allproducts-price__filter">
                        <h4>Precio</h4>
                        <div className="allproducts-price__item">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={preciosSeleccionados.includes('bajo')}
                                    onChange={() => handlePrecioChange('bajo')}
                                />
                                <span>Bajo (0 - 33)</span>
                            </label>
                        </div>
                        <div className="allproducts-price__item">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={preciosSeleccionados.includes('medio')}
                                    onChange={() => handlePrecioChange('medio')}
                                />
                                <span>Medio (34 - 66)</span>
                            </label>
                        </div>
                        <div className="allproducts-price__item">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={preciosSeleccionados.includes('alto')}
                                    onChange={() => handlePrecioChange('alto')}
                                />
                                <span>Alto (67 - 100)</span>
                            </label>
                        </div>
                    </div>

                    <div className="allproducts-price__manual-filter">
                        <h4>Rango de Precio</h4>
                        <div className="allproducts-price__manual-inputs">
                            <input 
                                type="chechkbox" 
                                placeholder="Mín" 
                                value={precioMin} 
                                onChange={(e) => setPrecioMin(e.target.value)} 
                                min="0" 
                            />
                            _
                            <input 
                                type="number" 
                                placeholder="Máx" 
                                value={precioMax} 
                                onChange={(e) => setPrecioMax(e.target.value)} 
                                min="0" 
                            />
                        </div>
                        <button 
                            className="allproducts-price__apply-button" 
                            onClick={() => {
                                setPreciosSeleccionados([]);
                            }}>
                            Aplicar Filtros
                        </button>
                    </div>
                </div>

                <div className="allproducts-products__container">
                    <div className='allproducts-products'>
                        {isLoading ? (
                            <p>Cargando productos...</p>
                        ) : productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <div className='allproducts-product__card' key={producto.id}>
                                    <Link to={`/ProductDetails/${producto.id}`}>
                                        <img 
                                            src={`http://localhost:3001${producto.imagen}`} 
                                            alt={producto.nombre} 
                                            className='allproducts-product__image'
                                        />
                                    </Link>
                                    <h4 className='allproducts-product__title'>{producto.nombre}</h4>
                                    <p className='allproducts-product__price'>${producto.precio.toFixed(3)} COP</p>
                                    <button 
                                        className='allproducts-add-to-cart__button'>
                                        Añadir al carrito
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No hay productos disponibles con los filtros seleccionados.</p>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default AllProducts;