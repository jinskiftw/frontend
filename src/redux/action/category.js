import * as Types from "../constants/actionTypes";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import createHeaders from "../../utils/headers";

export const getCategoryList = () => async (dispatch) => {
    
    try {
      // Your API call to get the category list
        let headers = createHeaders();
        headers['Content-Type'] = 'multipart/form-data';
        const response = await axios.get(`${baseUrl}/category/allCategories`, {
            headers,
        });

        return dispatch({
            type: Types.GET_CATEGORY_LIST_SUCCESS,
            data: response,
        });

    } catch (error) {
        return dispatch({
            type: Types.GET_CATEGORY_LIST_FAILURE,
            data: error
        });
    }
};
 