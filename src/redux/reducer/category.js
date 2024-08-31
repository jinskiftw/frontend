import * as Types from "../constants/actionTypes";

const initialState = {
 
    categoryList: []
};

export default (state = initialState, action) => {
 
    switch (action.type) {
        
        case Types.GET_CATEGORY_LIST_SUCCESS:
            return {
                ...state,
                categoryList: action.data.data,
            };
        case Types.GET_CATEGORY_LIST_FAILURE:
            return {
                ...state 
            };
        
        default:
            return state;
    }
};
