import React from 'react';
import { Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const route = useLocation()

    const isAuthenticated = () => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
        }

        return false;
    };

    return isAuthenticated() ? (
        children
    ) : (
        <Navigate to={`/?redirect=${encodeURIComponent(route.pathname)}`} replace />
    );
};

export default PrivateRoute;
