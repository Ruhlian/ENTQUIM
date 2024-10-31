import api from './Api'; // Asegúrate de que esto apunta a tu archivo de configuración de Axios
import { toast } from 'react-toastify'; // Importar toast

let lastRequestTime = 0; // Guardar el tiempo de la última solicitud
let lastAlertTime = 0; // Guardar el tiempo de la última alerta
const cooldownPeriod = 300; // Tiempo de espera en segundos
const alertCooldown = 10; // Tiempo de espera para mostrar alertas en segundos

const ContactService = {
    // Enviar un mensaje de contacto
    enviarMensaje: async (formData) => {
        const currentTime = Math.floor(Date.now() / 1000); // Obtener tiempo actual en segundos

        // Verificar si el usuario puede enviar otro correo
        if (currentTime - lastRequestTime < cooldownPeriod) {
            const waitTime = cooldownPeriod - (currentTime - lastRequestTime);
            if (currentTime - lastAlertTime >= alertCooldown) {
                toast.info(`Por favor, espera ${waitTime} segundos antes de enviar otro correo.`);
                lastAlertTime = currentTime; // Actualizar el tiempo de la última alerta
            }
            return; // No enviar el mensaje si aún está en cooldown
        }

        try {
            const response = await api.post('/contacto/enviar-correo', formData);
            lastRequestTime = currentTime; // Actualizar el tiempo de la última solicitud
            return response.data; // Devuelve la respuesta del servidor
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);

            // Manejo específico del error 429 (Demasiadas solicitudes)
            if (error.response && error.response.status === 429) {
                const waitTime = error.response.data.waitTime || cooldownPeriod;
                if (currentTime - lastAlertTime >= alertCooldown) {
                    toast.error(`Por favor, espera ${waitTime} segundos antes de enviar otro correo.`);
                    lastAlertTime = currentTime; // Actualizar el tiempo de la última alerta
                }
            } else {
                if (currentTime - lastAlertTime >= alertCooldown) {
                    toast.error("Hubo un problema al enviar el correo. Intenta de nuevo en 5 minutos.");
                    lastAlertTime = currentTime; // Actualizar el tiempo de la última alerta
                }
            }

            throw error; // Lanza el error para que el componente pueda manejarlo
        }
    }
};

export default ContactService;
