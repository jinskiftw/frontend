import { jwtDecode } from 'jwt-decode';
import { logoutAction } from '../redux/action/auth';

export const checkTokenValidity = (token, dispatch) => {
    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            window.localStorage.removeItem('token');
            dispatch(logoutAction());
        }
    }
};
