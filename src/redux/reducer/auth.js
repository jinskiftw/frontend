import * as Types from "../constants/actionTypes";

const initialState = {
  userData: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Types.REGISTER:
    case Types.LOGIN:
      return {
        ...state,
        userData: [action.data.data.userDetails],
        error: null,
      };
    case Types.USER_PROFILE:
      return {
        ...state,
        userData: [action.data.data.data],
        error: null,
      };
    case Types.LOGIN_FAILURE:
      return {
        ...state,
        error: action.data,
      };
    case Types.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        error: action.data,
      };
    case Types.LOGOUT:
      return {
        ...state,
        userData: [],
        error: null,
      };
    case Types.UPDATE_USER_DATA:
        return {
          ...state,
          userData: action.payload,
        };
    default:
      return state;
  }
};
