export const validateCardNumber = (cardNumber) => {
    return /^\d{16}$/.test(cardNumber); // Solo permite 16 dígitos
  };
  
  export const validateExpiryDate = (expiryDate) => {
    const [month, year] = expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Últimos dos dígitos del año
    const currentMonth = now.getMonth() + 1;
  
    // Valida formato MM/AA, que MM esté entre 01 y 12, y que no haya expirado
    return (
      /^\d{2}\/\d{2}$/.test(expiryDate) &&
      +month >= 1 && +month <= 12 &&
      (+year > currentYear || (+year === currentYear && +month >= currentMonth))
    );
  };
  
  export const validateCVC = (cvc) => {
    return /^\d{3}$/.test(cvc); // Exactamente 3 dígitos
  };
  
  export const validateCardholderName = (name) => {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$/.test(name); // Máximo 30 caracteres y solo letras
  };
  
  export const validateAddress = (address) => {
    return /^[A-Za-z0-9\s\.,#-]{1,100}$/.test(address); // Hasta 100 caracteres, permitiendo ciertos símbolos
  };
  
  export const validateCountryOrCity = (name) => {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$/.test(name); // Máximo 30 caracteres y solo letras
  };
  
  