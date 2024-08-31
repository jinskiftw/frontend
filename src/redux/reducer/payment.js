// reducers.js
const initialState = {
    userData: null,
    paymentResponse: null,
    paymentError: null,
  };
  
  const paymentReducer = (state = initialState, action) => {
    console.log("action=>",action)
    switch (action.type) {
      case 'PAYMENT_SUCCESS':
        return {
          ...state,
          userData: action.userData,
          paymentResponse: action.payload,
          paymentError: null,
        };
      case 'PAYMENT_FAILURE':
        return {
          ...state,
          userData: null,
          paymentResponse: null,
          paymentError: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default paymentReducer;