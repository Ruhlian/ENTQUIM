import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';
import Images from "../../utils/Images/Images";


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="footer">
            <div className="footer-logos__container">
                <img className="main-logo" src={Images.logos.logo} alt="Logo ENTQUIM"></img>
                <img className="secondary-logo" src={Images.logos.bluebrand} alt="Logo ENTQUIM"></img>
            

                <div className="footer__socials">
                    <Link><img src={Images.socials.whatsapp} alt="Whatsapp"></img></Link>
                    <Link><img src={Images.socials.instagram} alt="Instagram"></img></Link>
                    <Link><img src={Images.socials.linkedin} alt="LinkedIn"></img></Link>
                </div>
            </div>
            
            <div className="footer__content">
            <div className="footer__information">
                <h3>Información</h3>
                <Link to={"/AccountManage"}>Mi cuenta</Link>
                <Link>Términos y Condiciones</Link>
                <Link>Pólitica de Tratamiento de Protección de Datos</Link>
            </div>

            <div className="footer__about">
                <h3>Conócenos</h3>
                <Link to={'/Nosotros'}>Quienes somos</Link>
            </div>

            <div className="footer__contact">
                <h3>Contáctanos</h3>
                <Link to={"/Contacto"}>Enviar Correo</Link>
                <Link>+57 3106189254</Link>
                <Link>Transversal 106 #77-14</Link>
            </div>

            <div className="footer__suppliers">
                <h3>Proveedores</h3>
                <img className="italy" alt="Italia" src={Images.flags.italia}></img>
                <img className="india" alt="India" src={Images.flags.india}></img>
                <img className="corea" alt="Corea del Sur" src={Images.flags.corea}></img>
                <img className="malasia" alt="Malasia" src={Images.flags.malasia}></img>
                <img className="china" alt="China" src={Images.flags.china}></img>
            </div>
            </div>
            <div className="footer__copyright">
                © {currentYear} ENTQUIM. Todos los derechos reservados.
            </div>
        </div>
    );
};

export default Footer;
