import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas

const useAutoLogout = (timeoutDuration) => {
    const { handleLogout } = useAuth(); // Aquí puede estar el problema

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = payload.exp * 1000; // Convertir a milisegundos
                const currentTime = Date.now();

                // Si el token ha expirado, llamar a handleLogout
                if (currentTime >= expirationTime) {
                    handleLogout();
                }
            }
        };

        // Verificar el token inmediatamente
        checkTokenExpiration();

        // Configurar el intervalo para verificar cada hora (3600000 ms)
        const interval = setInterval(checkTokenExpiration, timeoutDuration);

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, [timeoutDuration, handleLogout]);
};

export default useAutoLogout;
