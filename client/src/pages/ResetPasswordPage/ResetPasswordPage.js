import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Ruta para contexto de autenticación
import AuthService from "../../services/AuthService"; // Ruta para el servicio de autenticación
import './ResetPasswordPage.css';
import { validateCorreo } from "../../utils/helpers"; // Validación de formato de correo

const ResetPasswordPage = () => {
  const { showToast } = useAuth(); // Mostrar notificaciones (éxito o error)
  const [correo, setCorreo] = useState('');
  const [correoConfirmacion, setCorreoConfirmacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [correoError, setCorreoError] = useState(''); // Errores relacionados con el formato del correo
  const [formError, setFormError] = useState(''); // Errores generales del formulario

  // Manejo del cambio en el campo de correo
  const handleCorreoChange = (e) => {
    const value = e.target.value.slice(0, 35); // Límite de caracteres
    setCorreo(value);

    if (!validateCorreo(value)) {
      setCorreoError('El formato debe ser nombre@dominio.com');
    } else {
      setCorreoError('');
    }
  };

  // Manejo del cambio en el campo de confirmación del correo
  const handleCorreoConfirmacionChange = (e) => {
    setCorreoConfirmacion(e.target.value.slice(0, 35)); // Límite de caracteres
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Reiniciar errores previos

    // Validación: correos coincidentes
    if (correo !== correoConfirmacion) {
      const errorMsg = "Los correos electrónicos no coinciden.";
      setFormError(errorMsg);
      showToast(errorMsg, "error");
      return;
    }

    // Validación: errores de formato de correo
    if (correoError) {
      setFormError(correoError);
      showToast(correoError, "error");
      return;
    }

    // Establecer estado de carga
    setLoading(true);

    try {
      // Llamar al servicio de restablecimiento
      const responseMessage = await AuthService.requestPasswordReset(correo);
      showToast(responseMessage || "Revisa tu correo para continuar.", "success");
    } catch (error) {
      // Manejo de errores desde el servicio
      const errorMessage = error.message || "Hubo un error al procesar la solicitud.";
      setFormError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      // Terminar estado de carga
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 className="title">Restablecer contraseña</h2>
        <p className="description">
          Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="form-reset">
          {/* Campo de correo electrónico */}
          <div className="input-group">
            <label htmlFor="correo" className="input-label">
              Correo Electrónico
            </label>
            <input
              id="correo"
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={correo}
              onChange={handleCorreoChange}
              required
              className={`input-email ${correoError ? 'input-error' : ''}`}
              aria-describedby="correo-error"
            />
            {correoError && (
              <p id="correo-error" className="error-message" role="alert">
                {correoError}
              </p>
            )}
          </div>

          {/* Campo de confirmación de correo */}
          <div className="input-group">
            <label htmlFor="correoConfirmacion" className="input-label">
              Confirmar Correo Electrónico
            </label>
            <input
              id="correoConfirmacion"
              type="email"
              placeholder="Confirme su correo electrónico"
              value={correoConfirmacion}
              onChange={handleCorreoConfirmacionChange}
              required
              className="input-email"
            />
          </div>

          {/* Mostrar errores generales del formulario */}
          {formError && (
            <p className="error-message" role="alert">
              {formError}
            </p>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading || correoError || formError}
          >
            {loading ? 'Enviando...' : 'Solicitar restablecimiento'}
          </button>
        </form>

        <p className="recommendation-message">
          Recuerda revisar tu bandeja de entrada y la carpeta de spam por si acaso. Si no recibes el correo, intenta nuevamente.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
