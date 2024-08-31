import * as yup from "yup";
import {
  INVALID_EMAIL,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  FIRST_NAME_REQUIRED,
  CONFIRM_PASSWORD_REQUIRED,
} from "../constants/validationMessege";

export const registerValidation = yup.object().shape({
  fullName: yup.string().required(FIRST_NAME_REQUIRED).nullable(),
  email: yup.string().required(EMAIL_REQUIRED).email(INVALID_EMAIL).nullable(),
  password: yup
    .string()
    .required(PASSWORD_REQUIRED)
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'Password must contain at least one letter and one number'
    )
    .nullable(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required(CONFIRM_PASSWORD_REQUIRED)
    .nullable(),
});

export const logInValidation = yup.object().shape({
  email: yup.string().required(EMAIL_REQUIRED).email(INVALID_EMAIL).nullable(),
  password: yup.string().required(PASSWORD_REQUIRED).nullable(),
});

export const forgotPasswordValidation = yup.object().shape({
  email: yup.string().required(EMAIL_REQUIRED).email(INVALID_EMAIL).nullable(),
});
export const resetPasswordValidation = yup.object().shape({
  password: yup
    .string()
    .required(PASSWORD_REQUIRED)
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      'Password must contain at least one letter and one number'
    )
    .nullable(),
  confirm_password: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required(CONFIRM_PASSWORD_REQUIRED)
    .nullable(),
});