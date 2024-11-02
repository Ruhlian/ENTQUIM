import api from './Api';

export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await api.post('/metodos-pago', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error al añadir el método de pago:', error);
    throw error;
  }
};
