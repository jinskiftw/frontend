import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";
 

export const carData = (data) => {
   // console.log('data -->>', data);
    return async (dispatch) => {
        try {
            let headers = createHeaders();
            headers['Content-Type'] = 'multipart/form-data';
            const response = await axios.post(`${baseUrl}/user/cars`, data, {
                headers,
            });
            return dispatch({
                type: Types.CAR_DETAILS,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.CAR_DETAILS_FAILURE,
                data: err,
            });
        }
    };
};

export const getAllCarDetails = (params={}) => {
    return async (dispatch) => {
        try {
            const headers = createHeaders();
            const response = await axios.get(`${baseUrl}/user/allCars`, {
                params,
                headers,
            });
            console.log("am i working");
            return dispatch({
                type: Types.ALL_CARS_DATA,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};

export const getAllArchivedCarDetails = (params={}) => {
    return async (dispatch) => {
        try {
            const headers = createHeaders();
            const response = await axios.get(`${baseUrl}/user/allArchivedCars`, {
                params,
                headers,
            });
            console.log("what is respo",response); 
            return dispatch({
                type: Types.ALL_ARCHIVED_CARS_DATA,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_ARCHIVED_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};



export const getCarDetailsById = (id) => {
    return async (dispatch) => {
        try {
            const headers = createHeaders();
            const response = await axios.get(`${baseUrl}/user/cars/${id}`, {
                headers,
            });
            return dispatch({
                type: Types.SINGLE_CARS_DATA,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};

export const updateCarDetails = (id, data) => {
    return async (dispatch) => {
        try {
            let headers = createHeaders();
            // headers['Content-Type'] = 'multipart/form-data';
            const response = await axios.put(`${baseUrl}/user/updateCars/${id}`, data, {
                headers,
            });
            //console.log(response, "response");
            return dispatch({
                type: Types.ALL_CARS_DATA,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};

export const updateCarRecordDetails = (id, data) => {
    return async (dispatch) => {
        try {
            if(data.logDate!==undefined)
            {
                const logDate=data.logDate; 
                const [year, month, day] = logDate.split("-").map(Number);

                data.logDate=new Date(); 
                data.logDate.setFullYear(year);
                data.logDate.setMonth(month - 1); // Months are zero-based, so subtract 1
                data.logDate.setDate(day);
                
          
                console.log( data.logDate);
            }
            console.log("data is ",data);
            let headers = createHeaders();
            // headers['Content-Type'] = 'multipart/form-data';
            const response = await axios.post(`${baseUrl}/user/updateCarRecords/${id}`, data, {
                headers,
            });
            //console.log(response, "response");
            return dispatch({
                type: Types.ALL_CARS_DATA,
                data: response,
            });
        } catch (err) {
            console.log(err);
            return dispatch({
                type: Types.ALL_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};



export const getCarRecordDetails = (id,type,search={}) => {
    return async (dispatch) => {
        try {
            let headers = createHeaders();
            // headers['Content-Type'] = 'multipart/form-data';
            const params={...search,type:type};
            const response = await axios.get(`${baseUrl}/user/car/${id}/records`, {params,
                headers,
            });
            console.log("response=>", response );
            return dispatch({
                type: Types.CAR_RECORDS_DETAILS,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};


export const updateCarImageDetails = (carId, imageId, data) => {
    for (var pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
    
    return async (dispatch) => {
        try {
            let headers = createHeaders();
            headers['Content-Type'] = 'multipart/form-data';
            const response = await axios.put(`${baseUrl}/user/updateImage/${carId}/${imageId}`, data, {
                headers,
            });
            //console.log(response, "response");
            return dispatch({
                type: Types.ALL_CARS_DATA,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};

export const updateCarImage = (carId, data) => {
    for (var pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
    
    return async (dispatch) => {
        try {
            let headers = createHeaders();
            headers['Content-Type'] = 'multipart/form-data';
            const response = await axios.put(`${baseUrl}/user/updateImage/${carId}`, data, {
                headers,
            });
            //console.log(response, "response");
            return dispatch({
                type: Types.ALL_CARS_DATA,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_CARS_FAILURE,
                data: err.response,
            });
        }
    };
};
export const resetSingleCarData = () => ({
    type: Types.RESET_SINGLE_CAR_DATA,
});

