import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import ApplicationMenu from "./Pages/ApplicationMenu";
import MyGarageDashboard from "./Pages/MyGarageDashboard";
import AddCar from "./Pages/AddCar";
import Payment from "./Pages/Payment";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import CreateNewRecord from "./Pages/CreateNewRecord";
import { ToastContainer, toast } from "react-toastify";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import PrivateRoute from "./Component/imageSlider/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "./redux/action/auth";
import { checkTokenValidity } from "./utils/tokenExpire";
import ConfirmAccount from "./Pages/ConfirmAccount/ConfirmAccount";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import ScrollRestoration from "./Component/scrollRestoration";
import config from './config';
const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  const options = {
    // passing the client secret obtained from the server
    clientSecret: config.STRIPE_SECRET_KEY,
  };
  

  useEffect(() => {
    checkTokenValidity(token, dispatch);
  }, [location.pathname, token, dispatch]);
  return (
    <>
         <ScrollRestoration />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
      
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Elements stripe={stripePromise} >
            <PrivateRoute>
              <MyGarageDashboard />
            </PrivateRoute>
            </Elements>
          }
        />

        <Route path={"/car/:car_id/add_record"}
          element={
            <PrivateRoute>
                  
                 <ApplicationMenu setTab={setTab} tab={1} />
            </PrivateRoute>   
          }
        />
        <Route path={"/car/:car_id/document_tracking"}
          element={
            <PrivateRoute>
                  
                 <ApplicationMenu setTab={setTab} tab={4} />
            </PrivateRoute>
          }
        />
        <Route path={"/car/:car_id/cost_dashboard"}
          element={
            <PrivateRoute>
                  
                 <ApplicationMenu setTab={setTab} tab={3} />
            </PrivateRoute>
          }
        />


        <Route path={"/car/:car_id/vehicle_log"}
          element={
            <PrivateRoute>
                  
                 <ApplicationMenu setTab={setTab} tab={2} />
            </PrivateRoute>
          }
        />

        <Route path={"/profile"}
          element={
            <Elements stripe={stripePromise} >
            <PrivateRoute>
                 <Profile  />
            </PrivateRoute> 
            </Elements>
          }
        />

        
      <Route path={"/payment"}
          element={
           
            <PrivateRoute>
                 <Payment  />
            </PrivateRoute> 
            
          }
        />


        <Route path={"/add_car"}
          element={
            <PrivateRoute>
              <AddCar setTab={setTab} />
            </PrivateRoute>
          }
        />
        <Route
          path={"/menu"}
          element={
            <PrivateRoute>
              <ApplicationMenu setTab={setTab} tab={tab} />
            </PrivateRoute>
          }
        />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/user/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/confirm/:token" element={<ConfirmAccount />} />
       
      </Routes>
      
      
    </>
  );
}
