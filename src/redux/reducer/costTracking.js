
import * as Types from "../constants/actionTypes";

const initialState = {
    costBreakingData: null,
    ownershipData: null,
    data: null
};


export default (state = initialState, action) => {
    console.log("action is ",action.type);
    console.log("state is ",state); 
    switch (action.type) {
        
        case Types.COST_TRACKING_COST_OF_OWNERSHIP:
        
            return {
                ...state,
                ownershipData: { ...state, response: action.data  },
                
            };
            case Types.COST_TRACKING_TOTAL_COST_BREAKING:
                return {
                    ...state,
                    costBreakingData: { ...state, response: action.data  },
                    
                };

          
        default :
            return state;
    }

}