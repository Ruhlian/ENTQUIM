import React from "react";
import './AboutUs.css';
import ValuesCarousel from "../../components/ValuesCarousel/ValuesCarousel";

const AboutUs = () => {
    return (
        <>
            <div className="about-image__container">
                <div className="about-image-titles__container">
                    <h2 className="about-image-title">ENTQUIM</h2>
                    <h3 className="about-image-subtitle">Compromiso, calidad y evolución.</h3>
                </div>
            </div>

        <div className="about__container">
            <h1 className="about-title">¿Quienes somos?</h1>
            <p className="about-content-one">ENTQUIM es una destacada empresa nacional con un equipo de socios y un capital 100% colombiano. Nos especializamos en la fabricación y comercialización a nivel nacional de pesticidas químicos diseñados para el control eficaz de una amplia gama de plagas que pueden comprometer la calidad de vida de las personas.</p>
            <p className="about-content-two">Reconocemos la oportunidad estratégica que se presenta debido al creciente índice de infestaciones que afectan de manera crítica a los seres humanos, a los animales domésticos, así como a los cultivos y alimentos. Este fenómeno impacta directamente en la salud pública y la salubridad de la población, lo que subraya la importancia de nuestra labor en la protección de la calidad de vida y el bienestar general.</p>
        </div>

        <ValuesCarousel/>

        <div className="mision-vision__container">
            <div className="mision-vision__item mision-vision__title">
                MISIÓN
            </div>

            <div className="mision-vision__item mision-vision__content">
                Suministrar al mercado productos plaguicidas de calidad que satisfagan las necesidades y expectativas de nuestros clientes, empleados y socios, bajo el concepto del uso racional de los plaguicidas para proteger el medio ambiente, contribuyendo de esta manera al desarrollo sostenible del país.
            </div>

            <div className="mision-vision__item mision-vision__content">
                Aspiramos a ser la empresa líder en plaguicidas químicos, ofreciendo productos de alta calidad que ganen la confianza de nuestros clientes. Ampliaremos nuestro portafolio para cubrir sectores clave y capacitaremos a nuestro equipo para asegurar la mejora continua y la excelencia en nuestros procesos.
            </div>

            <div className="mision-vision__item mision-vision__title">
                VISIÓN
            </div>
        </div>

        <div className="main-phrase__container">
            <p>{"<<"}Hemos avanzado significativamente gracias a nuestro enfoque innovador y a un equipo comprometido. Cada desafío nos impulsa a crecer y adaptarnos, fortaleciendo nuestra capacidad para ofrecer soluciones efectivas y evolucionar continuamente{">>"}</p>
            <p>Alfonso Reyes, propietario de ENTQUIM.</p>
        </div>

    </>
    )
    
}

export default AboutUs;