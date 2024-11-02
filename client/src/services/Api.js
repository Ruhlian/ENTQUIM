import axios from 'axios';

// Configurar la URL base de tu API desde una variable de entorno
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3002/api', // URL base de tu API
});

// Interceptor para agregar el token de autorización en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Manejo de errores en la solicitud
    console.error('Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response, // Retorna la respuesta si es exitosa
  (error) => {
    // Manejo de errores
    if (error.response) {
      // El servidor respondió con un estado fuera del rango de 2xx
      console.error('Error en la respuesta del servidor:', error.response.data);
      return Promise.reject(error.response.data); // Retorna el error
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      return Promise.reject('No se recibió respuesta del servidor.');
    } else {
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error('Error al configurar la solicitud:', error.message);
      return Promise.reject('Error al configurar la solicitud.');
    }
  }
);

export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await api.post('/metodos-pago', paymentData); // Ruta de la API en el backend
    return response.data;
  } catch (error) {
    console.error('Error al añadir el método de pago:', error);
    throw error;
  }
};

export default api;
