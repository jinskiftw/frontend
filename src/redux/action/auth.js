import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";

export const register = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${baseUrl}/user/register`, data);
      return dispatch({
        type: Types.REGISTER,
        data: response,
      });
    } catch (err) {
      return dispatch({
        type: Types.REGISTER_FAILURE,
        data: err.response,
      });
    }
  };
};

export const logIn = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${baseUrl}/user/login`, data);
      if (response.data.token) {
        //console.log('response.data.token -->>', response.data.token);
        window.localStorage.setItem("token", response.data.token)
      }
      return dispatch({
        type: Types.LOGIN,
        data: response,
      });
    } catch (err) {
      return dispatch({
        type: Types.LOGIN_FAILURE,
        data: err.response,
      });
    }
  };
};

export const getUserProfile = (params={}) => {
  return async (dispatch) => {
      try {
          const headers = createHeaders();
          const response = await axios.get(`${baseUrl}/user/profile`, {
              params,
              headers,
          });
          
          return dispatch({
              type: Types.USER_PROFILE,
              data: response,
          });
      } catch (err) {
          return dispatch({
              type: Types.USER_PROFILE_FAILURE,
              data: err.response,
          });
      }
  };
};

 

export const forgotPassword = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${baseUrl}/user/forget-password`, data);
      return dispatch({
        type: Types.FORGOT_PASSWORD,
        data: response,
      });
    } catch (err) {
      return dispatch({
        type: Types.FORGOT_PASSWORD_FAILURE,
        data: err.response,
      });
    }
  };
};

export const resetPassword = (data) => {
  
  return async (dispatch) => {
    try {
      const response = await axios.post(`${baseUrl}/user/reset-password`, data);
      console.log(response);
      return dispatch({
        type: Types.RESET_PASSWORD,
        data: response,
      });
    } catch (err) {
      return dispatch({
        type: Types.RESET_PASSWORD_FAILURE,
        data: err.response,
      });
    }
  };
};

export const logoutAction = () => {
  return {
    type: Types.LOGOUT,
  };
};

export const updateUserData = (userData) => ({
  type: Types.UPDATE_USER_DATA,
  payload: userData,
});