import React from 'react'
import "./style.css";
import passwordicon from "../../Assets/images/password.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { resetPasswordValidation } from '../../schema/auth';
import { useDispatch } from 'react-redux';
import { handleApiCall } from '../../utils/apiUtils';
import { resetPassword } from '../../redux/action/auth';
import { Navigate,useParams } from 'react-router-dom';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const { resetToken } = useParams();
    console.log("resetToken=>",resetToken)
    const initailData = {
        token: resetToken,
        password: "",
        confirm_password: "",
    };

    const handleResetPassword = async (values, { resetForm }) => {
       
        try {
            const success = await handleApiCall(dispatch, resetPassword(values));
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
                initialValues={initailData}
                validationSchema={resetPasswordValidation}
                onSubmit={handleResetPassword}
            >
                <Form>
                    <div className="register-box">
                        <h1>Reset Password</h1>
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
                            name="confirm_password"
                            placeholder="Enter your password"
                            />
                            <ErrorMessage
                            name="confirm_password"
                            component="div"
                            className="error-msg"
                            />
                            <span>
                            <img src={passwordicon} alt="" />
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

export default ResetPassword