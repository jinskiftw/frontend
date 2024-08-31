import { combineReducers } from "redux";
import auth from "./auth";
import car from "./car";
import carDocument from "./carDocument";
import notifications from "./notifications"
import costTracking from "./costTracking"
import subscription from "./subscription"
import payment from "./payment"
import category from "./category";

const rootReducer = combineReducers({
  auth,
  car,
  carDocument,
  costTracking,
  notifications,
  subscription,
  payment,
  category
 
});

export default rootReducer;
