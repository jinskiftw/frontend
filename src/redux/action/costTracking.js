import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";




export const costBreakdownByCategory = (catId) => {
  
    return async (dispatch) => {
        try {
            let headers = createHeaders();
          
            const response = await axios.get(`${baseUrl}/cost-tracking/cost-breakdown-by-category/${catId}`, {
                headers,
            });
            return dispatch({
                type: Types.COST_TRACKING_TOTAL_COST_BREAKING,
                data: response.data,
            });
        } catch (err) {
            return dispatch({
                type: Types.NOTIFICATIONS_FAILTURE,
                data: err,
            });
        }
    };
};



export const costOfOwnership = (carId,year) => {
  
    return async (dispatch) => {
        try {
            let headers = createHeaders();
          
            const response = await axios.get(`${baseUrl}/cost-tracking/cost-of-ownership/${carId}`, {
                params: {
                    year
              
                },
                headers,
            });
            return dispatch({
                type: Types.COST_TRACKING_COST_OF_OWNERSHIP,
                data: response.data,
            });
        } catch (err) {
            return dispatch({
                type: Types.COST_TRACKING_FAILURE,
                data: err,
            });
        }
    };
};



 