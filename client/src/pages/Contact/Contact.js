import React, { useState } from "react";
import './Contact.css';
import ContactService from '../../services/ContactService'; // Asegúrate de que la ruta sea correcta

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    ciudad: "",
    pais: "",
    mensaje: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar errores

  const [isWaiting, setIsWaiting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;
    let error = "";

    switch (name) {
      case "nombre":
        if (!value) {
          error = "El nombre es obligatorio";
        } else if (!nameRegex.test(value)) {
          error = "El nombre no puede contener números o caracteres especiales";
        }
        break;
      case "apellido":
        if (!value) {
          error = "El apellido es obligatorio";
        } else if (!nameRegex.test(value)) {
          error = "El apellido no puede contener números o caracteres especiales";
        }
        break;
      case "correo":
        if (!value) {
          error = "El correo es obligatorio";
        } else if (!emailRegex.test(value)) {
          error = "El correo no tiene un formato válido";
        }
        break;
      case "telefono":
        if (!value) {
          error = "El teléfono es obligatorio";
        } else if (!phoneRegex.test(value)) {
          error = "El teléfono debe contener entre 7 y 15 números";
        }
        break;
      case "ciudad":
        if (!value) {
          error = "La ciudad es obligatoria";
        } else if (!nameRegex.test(value)) {
          error = "La ciudad no puede contener números o caracteres especiales";
        }
        break;
      case "pais":
        if (!value) {
          error = "El país es obligatorio";
        } else if (!nameRegex.test(value)) {
          error = "El país no puede contener números o caracteres especiales";
        }
        break;
      case "mensaje":
        if (!value) {
          error = "El mensaje es obligatorio";
        } else if (value.length > 500) {
          error = "El mensaje no puede superar los 500 caracteres";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar el campo al cambiar su valor
    const error = validateField(name, value);

    setFormData({
      ...formData,
      [name]: value
    });

    // Actualizar los errores
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      validationErrors[key] = validateField(key, formData[key]);
    });

    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (!hasErrors) {
      try {
        const response = await ContactService.enviarMensaje(formData); // Enviar los datos al backend
        setSuccessMessage("El correo se ha enviado exitosamente");
        setErrorMessage(""); // Restablecer el mensaje de error

        // Iniciar el temporizador de espera
        setIsWaiting(true);
        setRemainingTime(300); // 5 minutos en segundos
        const interval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsWaiting(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000); // Actualiza cada segundo

        // Restablecer el formulario si es necesario
        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          telefono: "",
          ciudad: "",
          pais: "",
          mensaje: ""
        });

      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Manejar el caso de que el usuario deba esperar
          setErrorMessage(error.response.data.message);
          // No mostrar el toast
        } else {
          setErrorMessage("Hubo un problema al enviar el correo");
        }
        console.error("Error en la solicitud de correo", error);
      }
    }
  };

  return (
    <>
      <div className="contact-image__container">
        <div className="contact-image-titles__container">
          <h2 className="contact-image-title">CONTÁCTENOS</h2>
          <h3 className="contact-image-subtitle">Atenderemos sus dudas con gusto.</h3>
        </div>
      </div>

      <div className="contact-main__container">
        <form className="contact-form__container" onSubmit={handleSubmit}>
          <div className="contact-form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.nombre && <p className="error-message">{errors.nombre}</p>}
          </div>

          <div className="contact-form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.apellido && <p className="error-message">{errors.apellido}</p>}
          </div>

          <div className="contact-form-group">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.correo && <p className="error-message">{errors.correo}</p>}
          </div>

          <div className="contact-form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.telefono && <p className="error-message">{errors.telefono}</p>}
          </div>

          <div className="contact-form-group">
            <label htmlFor="ciudad">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.ciudad && <p className="error-message">{errors.ciudad}</p>}
          </div>

          <div className="contact-form-group">
            <label htmlFor="pais">País</label>
            <input
              type="text"
              name="pais"
              placeholder="País"
              value={formData.pais}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.pais && <p className="error-message">{errors.pais}</p>}
          </div>

          <div className="contact-form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              name="mensaje"
              placeholder="Escriba su mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="contact-input contact-textarea" // Agregada la nueva clase
            />
            {errors.mensaje && <p className="error-message">{errors.mensaje}</p>}
          </div>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mensaje de error */}

          <button type="submit" className="contact-submit__btn" disabled={isWaiting}>
            Enviar
          </button>
        </form>
      </div>
    </>
  );
};

export default Contact;
