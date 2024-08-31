import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";

export const getSubscriptionPlans = (params={}) => {
    return async (dispatch) => {
        try {
            const headers = createHeaders();
            const response = await axios.get(`${baseUrl}/plan`, {
                params,
                headers,
            });
            console.log("plan=>",response)
            return dispatch({
                type: Types.ALL_SUBSCRIPTIONS_DATA,
                data: response,
            });
        } catch (err) {
            return dispatch({
                type: Types.ALL_SUBSCRIPTIONS_FAILURE,
                data: err.response,
            });
        }
    };
};