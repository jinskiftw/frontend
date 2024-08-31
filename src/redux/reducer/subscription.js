import * as Types from "../constants/actionTypes";

const initialState = {
    subscriptionList: []
};

export default (state = initialState, action) => {
    console.log(action.type,"=>>",state,action);
    switch (action.type) {
        case Types.ALL_SUBSCRIPTIONS_DATA:
            return {
                ...state,
                subscriptionList: action.data.data.data,
            };
        case Types.ALL_SUBSCRIPTIONS_FAILURE:
            return {
                ...state,
                subscriptionList: [],
            };
        default:
            return state;
    }
};
