// helpers.js

// Función para validar el formato del correo electrónico
// Acepta correos en el formato: nombre@dominio.com, mínimo 15 caracteres antes del @, debe incluir número
export const validateCorreo = (correo) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida el formato de correo básico
    return emailRegex.test(correo); // Retorna true si es un correo válido
};


// Función para validar el nombre y apellido
// Acepta solo letras (incluidas letras acentuadas) y espacios, máximo 15 caracteres
export const validateName = (value) => /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,15}$/.test(value);

// Función para validar la contraseña
// Mínimo 8 caracteres, máximo 35 caracteres, con letras, números y al menos un símbolo
export const validateContrasena = (value) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,35}$/;
    return passwordRegex.test(value);
};
