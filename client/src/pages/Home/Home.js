import React from "react";
import './Home.css';
import Images from "../../utils/Images/Images";
import HomeCarousel from "../../components/HomeCarousel/HomeCarousel";
import MarketCompes from "../../components/MarketCompes/MarketCompes";

const Home = () => {

    return (
        <>
            <HomeCarousel />
            <div className="lol"></div>
            <MarketCompes />

            <div className="featured-product">
                <div className="featured-title__container">
                    <h2 className="featured__title">Producto destacado</h2>
                    <p className="featured__subtitle">Línea de insecticidas</p>
                </div>
                
                <div className="featured-products__container">
                        <div className="featured-product__container left">
                            <div className="featured-product__title-container">
                                <h4 className="featured-product__title">Para uso industrial</h4>
                            </div>
                            <div className="featured-product__content">
                                <div className="product-details__container-left">
                                    <h3 className="product-content__title">DELMETRIN 2.50 E.C</h3>
                                    <p>Insecticida piretroide líquido Concentrado Emulsionable (EC) con base de Deltametrina al 2.50% p/v, excelente para aplicación de choque y acción inmediata (KNOCK DOWN) sobre todo tipo de insectos rastreros y voladores en todos los ambientes.</p>
                                </div>
                                
                                <div className="order-product__container">
                                    <img 
                                        className="product-content__image" 
                                        src={Images.products.delmetrin250} 
                                        alt='DELMETRIN 2.50EC' 
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <p className="product-content__price">$19.700 COP</p>
                                    <button className="product-content__button">
                                        <img src={Images.icons.whitecart} alt="Añadir al carrito" className="featured-cart" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    <div className="featured-products__categorys-container">
                        <ul className="featured-products__list">
                            <li className="category-item"><img className="category-image__featured" src={Images.plagues.flea} alt="Pulga" /></li>
                            <li className="category-item"><img className="category-image__featured" src={Images.plagues.cockroach} alt="Cucaracha" /></li>
                            <li className="category-item"><img className="category-image__featured" src={Images.plagues.fly} alt="Mosca" /></li>
                            <li className="category-item"><img className="category-image__featured" src={Images.plagues.ant} alt="Hormiga" /></li>
                            <li className="category-item"><img className="category-image__featured" src={Images.plagues.mosquito} alt="Zancudo" /></li>
                        </ul>
                    </div>

                        <div className="featured-product__container-right">
                            <div className="featured-product__title-container">
                                <h4 className="featured-product__title">Para uso industrial</h4>
                            </div>

                            <div className="featured-product__content right">
                                <div className="order-product__container">
                                    <img 
                                        className="product-content__image-right" 
                                        src={Images.products.delmetrinMadera} 
                                        alt='DELMETRIN MADERA' 
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <p className="product-content__price">$112.600 COP</p>
                                    <button className="product-content__button">
                                        <img src={Images.icons.whitecart} alt="Añadir al carrito" className="featured-cart" />
                                    </button>
                                </div>
                                <div className="product-details__container-right">
                                    <h3 className="product-content__title">DELMETRIN MADERA</h3>
                                    <p>Inmunizante Insecticida piretroide líquido Concentrado Emulsionable (EC) a base de Deltametrina al 2.50% p/v, eficaz en la prevención y control de todos los insectos y hongos que atacan las maderas en todos los ambientes</p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
};

export default Home;
