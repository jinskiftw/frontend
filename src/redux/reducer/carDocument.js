import * as Types from "../constants/actionTypes";

const initialState = {
    response: [],
    data: null
};


export default (state = initialState, action) => {
    switch (action.type) {
        case Types.CAR_DOCUMENT:
            return {
                ...state,
                carDocument: { ...state, response: action.data.response,data:action.data },
                
            };
            case Types.CAR_DOCUMENT_LISTING:
                return {
                    ...state,
                    carDocumentListing: { ...state, response: action.data.response,data:action.data },
                    
                };
        default :
            return initialState;
    }

}