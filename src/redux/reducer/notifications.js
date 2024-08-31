import * as Types from "../constants/actionTypes";

const initialState = {
    response: [],
    data: null
};


export default (state = initialState, action) => {
    
    switch (action.type) {
        case Types.NOTIFICATIONS:
            return {
                ...state,
                notifications: { ...state, response: action.data  },
                
            };
      
        default :
            return state;
    }

}