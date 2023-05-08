import React, { useState, useContext } from 'react';
import CPCSS from './ChangePassword.module.css';
import { AuthContext } from "../../Hooks/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ErrorModal } from '../../Components/ErrorModal/ErrorModal';
import { SuccessModal } from '../../Components/SuccessModal/SuccessModal';
import axios from "axios";

export const ChangePassword = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [oldpasswordVisible, setOldPasswordVisible] = useState(false);
  const [newpasswordVisible, setNewPasswordVisible] = useState(false);
  const [repasswordVisible, setRePasswordVisible] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const customerId = user && user.id ? user.id : null;

  const passwordValidation = Yup.object().shape({
    old_password: Yup.string().required("Old password is required").min(6, "Password must be at least 6 characters")
      .matches(/^(?=.*\d)/, "Password must contain at least one number"),
    new_password: Yup.string().notOneOf([Yup.ref('old_password')], "New password must be different from old password")
      .required("New password is required").min(6, "Password must be at least 6 characters")
      .matches(/^(?=.*\d)/, "Password must contain at least one number"),
    re_password: Yup.string().oneOf([Yup.ref('new_password')], 'Passwords did not match').required("Confirm password is required").min(6, "Password must be at least 6 characters")
      .matches(/^(?=.*\d)/, "Password must contain at least one number"),
  });

  const initialValues = {
    old_password: "",
    new_password: "",
    re_password: "",
  };
  const toggleOldPasswordVisibility = () => {
    setOldPasswordVisible((prevState) => !prevState);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible((prevState) => !prevState);
  }
  const toggleRePasswordVisibility = () => {
    setRePasswordVisible((prevState) => !prevState);
  }
  const handleChangePasswordSubmit = async (values) => {
    try {
      const fieldData = {
        userId: customerId,
        currentPassword: values.old_password,
        newPassword: values.new_password,
      };
      const response = await axios({
        method: "post",
        url: `${host}/api/UserAuth/change_password`,
        data: fieldData,
        withCredentials: true,
      })

      if (response.status === 200) {
        setSuccess("Password changed successfully");
      }

    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          const errorObj = error.response.data.errors[0];
          if (errorObj.code === "PasswordMismatch") {
            setError(errorObj.description);
          } else {
            setError(errorObj.description);
          }
        } else {
          setError(error.message);
        }
      } else {
        setError(error.message);
      }
    }
  }
  return (
    <>
      <ErrorModal
        message={error}
        show={error !== ""}
        onClose={() => {
          setError("");
        }}
      />
      <SuccessModal
        message={success}
        show={success !== ""}
        onClose={() => setSuccess("")}
      />
      <div className={CPCSS["CP-main-container"]}>
        <h1 className={CPCSS["CP-heading"]}>Change password</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={passwordValidation}
          onSubmit={handleChangePasswordSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={CPCSS["CP-form"]}>
                <div className={CPCSS["CP-group"]}>
                  <label
                    htmlFor="old_password"
                    className={CPCSS["CP-label"]}
                  >
                    Old Password
                  </label>
                  <div className={CPCSS["CP-password"]}>
                    <Field
                      id="old_password"
                      type={oldpasswordVisible ? "text" : "password"}
                      name="old_password"
                      className={CPCSS["CP-input"]}
                      placeholder="Type your old password"
                    />
                    <span
                      className={CPCSS["CP-password-toggle"]}
                      onClick={toggleOldPasswordVisibility}
                    >
                      <i
                        className={`fas ${oldpasswordVisible ? "fa-eye" : "fa-eye-slash"
                          }`}
                      />
                    </span>
                  </div>
                  <ErrorMessage
                    name="old_password"
                    component="p"
                    className={CPCSS["CP-error"]}
                  />
                </div>

                <div className={CPCSS["CP-group"]}>
                  <label
                    htmlFor="new_password"
                    className={CPCSS["CP-label"]}
                  >
                    New Password
                  </label>
                  <div className={CPCSS["CP-password"]}>
                    <Field
                      id="new_password"
                      type={newpasswordVisible ? "text" : "password"}
                      name="new_password"
                      className={CPCSS["CP-input"]}
                      placeholder="Type your new password"
                    />
                    <span
                      className={CPCSS["CP-password-toggle"]}
                      onClick={toggleNewPasswordVisibility}
                    >
                      <i
                        className={`fas ${newpasswordVisible ? "fa-eye" : "fa-eye-slash"
                          }`}
                      />
                    </span>
                  </div>
                  <ErrorMessage
                    name="new_password"
                    component="p"
                    className={CPCSS["CP-error"]}
                  />
                </div>

                <div className={CPCSS["CP-group"]}>
                  <label
                    htmlFor="re_password"
                    className={CPCSS["CP-label"]}
                  >
                    Re-enter Password
                  </label>
                  <div className={CPCSS["CP-password"]}>
                    <Field
                      id="re_password"
                      type={repasswordVisible ? "text" : "password"}
                      name="re_password"
                      className={CPCSS["CP-input"]}
                      placeholder="Re-enter your new password"
                    />
                    <span
                      className={CPCSS["CP-password-toggle"]}
                      onClick={toggleRePasswordVisibility}
                    >
                      <i
                        className={`fas ${repasswordVisible ? "fa-eye" : "fa-eye-slash"
                          }`}
                      />
                    </span>
                  </div>
                  <ErrorMessage
                    name="re_password"
                    component="p"
                    className={CPCSS["CP-error"]}
                  />
                </div>

                <button
                  type="submit"
                  className={CPCSS["CP-button"]}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}