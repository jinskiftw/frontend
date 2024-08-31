import React from 'react'
import "./style.css";
import emailicon from "../../Assets/images/email-icon.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { forgotPasswordValidation } from '../../schema/auth';
import { useDispatch } from 'react-redux';
import { handleApiCall } from '../../utils/apiUtils';
import { forgotPassword } from '../../redux/action/auth';
import { Navigate } from 'react-router-dom';

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const handleForgotPassword = async (values, { resetForm }) => {
        const data = {
            role: "user",
            ...values
        }
        try {
            const success = await handleApiCall(dispatch, forgotPassword(data));
            if (success) {
                resetForm();
                <Navigate to="/login" />;
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="forgotPassword-page">
            <Formik
                initialValues={{ email: "" }}
                validationSchema={forgotPasswordValidation}
                onSubmit={handleForgotPassword}
            >
                <Form>
                    <div className="register-box">
                        <h1>Enter email for reset password</h1>
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
                        <div className="btn-register-row">
                            <button className="btn-register">Reset</button>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div >
    )
}

export default ForgotPassword