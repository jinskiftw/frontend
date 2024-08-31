import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";

  
  export const getPayment = (params={}) => {
    return async (dispatch) => {
      try {
            const headers = createHeaders();
            const response = await axios.post(`${baseUrl}/process-payment`, params, {
                headers,
            });
            console.log("response=>",response)
        if (response.data.status) {
          dispatch({
            type: 'PAYMENT_SUCCESS',
            payload: response.data.message,
            userData: response.data.UserData
          });
        } else {
          dispatch({
            type: 'PAYMENT_FAILURE',
            payload: response.data.errors,
          });
        }
      } catch (error) {
        dispatch({
            type: 'PAYMENT_FAILURE',
            payload: error.message,
          });
      }
    };
  };