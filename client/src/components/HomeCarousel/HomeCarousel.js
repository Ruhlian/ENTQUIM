import React, { useState, useEffect } from 'react';
import './HomeCarousel.css';
import Images from '../../utils/Images/Images';

const HomeCarousel = () => {
    const images = [
        { src: Images.homeCarousel.img1, title: 'MÁS DE 15 AÑOS', subtitle: 'creando soluciones para ti' },
        { src: Images.homeCarousel.img2, title: 'INNOVACIÓN CONSTANTE', subtitle: 'para tu negocio' },
        { src: Images.homeCarousel.img3, title: 'EXPERIENCIA Y CALIDAD', subtitle: 'en cada proyecto' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Cambia de imagen cada 5 segundos

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="carousel-container">
            <div className="carousel-slide">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image.src})` }}
                    >
                        {index === currentIndex && (
                            <>
                                {/* Nueva capa con gradiente y blur */}
                                <div className="carousel-overlay"></div>
    
                                {/* Texto encima de la capa con gradiente */}
                                <div className="carousel-caption">
                                    <h2>{image.title}</h2>
                                    <p>{image.subtitle}</p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default HomeCarousel;
