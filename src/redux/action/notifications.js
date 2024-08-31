import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";




export const getNotifications = () => {
  
    return async (dispatch) => {
        try {
            let headers = createHeaders();
          
            const response = await axios.get(`${baseUrl}/notifications`, {
                headers,
            });
            return dispatch({
                type: Types.NOTIFICATIONS,
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



 