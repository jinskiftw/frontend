import React, { useState, useEffect } from "react";
import "./style.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import googleicon from "../../Assets/images/google-icon.png";
import nameicon from "../../Assets/images/name-icon.svg";
import emailicon from "../../Assets/images/email-icon.svg";
import passwordicon from "../../Assets/images/password.svg";
import { registerValidation } from "../../schema/auth";
import { handleApiCall } from "../../utils/apiUtils";
import { register } from "../../redux/action/auth";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import GoogleLogin from "@leecheuk/react-google-login";
import { gapi } from "gapi-script"

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initailData = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    const clientId ="237931209243-fjcjfofdbh8lumfcqct9llt5kjmmmi4f.apps.googleusercontent.com"
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  });

  const handleRegister = async (values, { resetForm }) => {
    try {
      const success = await handleApiCall(dispatch, register(values));
      if (success) {
        resetForm();
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const responseGoogle = async (response) => {
    if (response.tokenId) {
      const values = {
        fullName: response?.profileObj?.name,
        email: response?.profileObj?.email,
        password: response?.googleId,
        confirmPassword: response?.googleId,
      };
      try {
        const success = await handleApiCall(dispatch, register(values));
        if (success) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="register-page">
        <Formik
          initialValues={initailData}
          validationSchema={registerValidation}
          onSubmit={handleRegister}
        >
          <Form>
            <div className="register-box">
              <h1>Register Now</h1> 
              <div className="google-icon">
                <GoogleLogin
                  clientId="237931209243-fjcjfofdbh8lumfcqct9llt5kjmmmi4f.apps.googleusercontent.com"
                  render={(renderProps) => (
                    <div className="googlebtn" onClick={renderProps.onClick}>
                      <img src={googleicon} alt="" />
                      <h4>Continue with Google</h4>
                    </div>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
              <div className="orw-row"> or </div>
              <div className="register-row">
                <label>Full Name</label>
                <Field
                  type="text"
                  name="fullName"
                  placeholder="Name"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="error-msg"
                />
                <span>
                  <img src={nameicon} alt="" />
                </span>
              </div>
              <div className="register-row">
                <label>Email Address</label>
                <Field
                  type="text"
                  name="email"
                  placeholder="Email"
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
              <div className="register-row padding0">
                <label>Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error-msg"
                />
                <span>
                  <img src={passwordicon} alt="" />
                </span>
              </div>
              <div className="terms-conditions">
                <p className="">
                  By clicking Register you agree to{" "}
                  <a href="https://wheelmanllc.com/termsandconditions">Terms &amp; Conditions</a>
                </p>
              </div>
              <div className="btn-register-row">
                <button type="submit" className="btn-register">
                  Register
                </button>
              </div>
              <h3 className="terms-conditions">
                Already have an account? <a href="/">Login Now</a>
              </h3>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
}
