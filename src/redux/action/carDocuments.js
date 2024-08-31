import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";




export const get = (car_id,params={}) => {
  
    return async (dispatch) => {
        try {
            let headers = createHeaders();
          
            const response = await axios.get(`${baseUrl}/user/car/${car_id}/document`, {
                params,
                headers,
            });
            return dispatch({
                type: Types.CAR_DOCUMENT_LISTING,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.CAR_DOCUMENT_FAILURE,
                data: err,
            });
        }
    };
};




export const create = (data,car_id) => {
    console.log('data -->>', data);
    return async (dispatch) => {
        try {
            let headers = createHeaders();
            headers['Content-Type'] = 'multipart/form-data';
            const response = await axios.post(`${baseUrl}/user/car/${car_id}/document`, data, {
                headers,
            });
            return dispatch({
                type: Types.CAR_DOCUMENT,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.CAR_DOCUMENT_FAILURE,
                data: err.response,
            });
        }
    };
};

export const update = (data,id) => {
    console.log('data -->>', data);
    return async (dispatch) => {
        try {
            let headers = createHeaders();
            headers['Content-Type'] = 'multipart/form-data';
            const response = await axios.post(`${baseUrl}/user/document/${id}`, data, {
                headers,
            });
            return dispatch({
                type: Types.CAR_DOCUMENT,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.CAR_DOCUMENT_FAILURE,
                data: err.response,
            });
        }
    };
};





