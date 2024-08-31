import React, { useEffect, useState } from "react";
import "./style.css";
import googleicon from "../../Assets/images/google-icon.png";
import emailicon from "../../Assets/images/email-icon.svg";
import passwordicon from "../../Assets/images/password.svg";
import { logInValidation } from "../../schema/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { handleApiCall } from "../../utils/apiUtils";
import { useDispatch } from "react-redux";
import { logIn } from "../../redux/action/auth";
import { Navigate, useNavigate } from "react-router-dom";
import GoogleLogin from "@leecheuk/react-google-login";
import { gapi } from "gapi-script";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initailData = {
    email: "",
    password: "",
  };

  useEffect(() => {
    const clientId =
      "237931209243-fjcjfofdbh8lumfcqct9llt5kjmmmi4f.apps.googleusercontent.com";
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  });

  const handleLogin = async (values, { resetForm }) => {
    try {
      const success = await handleApiCall(dispatch, logIn(values));
      if (success) {
        resetForm();
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const responseGoogle = async (response) => {
    if (response?.tokenId) {
      const values = {
        email: response?.profileObj?.email,
        password: response?.googleId,
      };
      try {
        const success = await handleApiCall(dispatch, logIn(values));
        if (success) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const isUserAuthenticated = !!localStorage.getItem("token");
  const history = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated, and redirect if true
    if (isUserAuthenticated) {
      console.log("navigating to dashboard");
      navigate("/dashboard"); // Replace with your actual dashboard route
    }
  }, [isUserAuthenticated, history]);
  return (
    <>
      <div className="login-page">
        <Formik
          initialValues={initailData}
          validationSchema={logInValidation}
          onSubmit={handleLogin} 
        > 
          <Form>
            <div className="register-box">
              <h1>Welcome Back</h1>
              <div className="google-icon">
                <GoogleLogin
                  cookiePolicy={"single_host_origin"}
                 
                  clientId="237931209243-fjcjfofdbh8lumfcqct9llt5kjmmmi4f.apps.googleusercontent.com"
                  render={(renderProps) => (
                    <div className="googlebtn" onClick={renderProps.onClick}>
                      <img src={googleicon} alt="" />
                      <h4>Continue with Google</h4>
                    </div>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                />
              </div>
              <div className="orw-row"> or </div>
              <div className="register-row">
                <label>Email Address</label>
                <Field
                  type="text"
                  name="email"
                  placeholder="jhon.horald@gmail.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-msg"
                />
                <span>
                  <img src={emailicon} alt="" />
                </span>
              </div>
              <div className="register-row">
                <label>Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-msg"
                />
                <span>
                  <img src={passwordicon} alt="" />
                </span>
              </div>
              <div className="terms-conditions">
                <p className="text-right">
                  <a href="/forgotPassword">Forgot Password?</a>
                </p>
              </div>
              <div className="btn-register-row">
                <button className="btn-register">Login</button>
              </div>
              <h3 className="terms-conditions">
                Don't have an account? <a href="/register">Register Now</a>
              </h3>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
}
