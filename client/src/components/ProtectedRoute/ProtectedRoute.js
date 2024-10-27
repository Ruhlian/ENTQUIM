import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, allowChangePassword, allowAccessWithoutAuth }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    console.log('User:', user);
    console.log('User Role:', user?.rol);
    console.log('Allowed Roles:', allowedRoles);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        if (!allowAccessWithoutAuth) {
            return <Navigate to="/Iniciar-Sesion" state={{ from: location }} replace />;
        }
    }

    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/access-denied" state={{ from: location }} replace />;
    }

    const hasChangedPassword = localStorage.getItem('passwordChanged') === 'true';
    
    if (allowChangePassword && hasChangedPassword) {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
