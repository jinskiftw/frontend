import * as Types from "../constants/actionTypes";

const initialState = {
    carData: [],
    archivedCarData:[],
    singleCarData: null,
    categoryList: []
};

export default (state = initialState, action) => {
    console.log(">> state is " ,state);
    console.log("single action is ",action);
    switch (action.type) {
        case Types.CAR_DETAILS:
            return {
                ...state,
                carData: { ...state, carData: action.data.data },
            };
        case Types.ALL_CARS_DATA:
            return {
                ...state,
                carData: action.data.data,
            };
        case Types.ALL_ARCHIVED_CARS_DATA:
            console.log("hain ",action.data.data);
                return {
                    ...state,
                    archivedCarData: action.data.data,
                };
        case Types.SINGLE_CARS_DATA:
          
            return {
                ...state,
                singleCarData: action.data.data
            }
        case Types.CAR_RECORDS_DETAILS:
            return {
                ...state,
                carRecordsDetail: action.data.data
            }
            
        case Types.RESET_SINGLE_CAR_DATA:
            return {
                ...state,
                singleCarData: null,
            };
 
        
        default:
            return state;
    }
};
