import React, { useState, useContext } from "react";
import LoginCSS from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ErrorModal } from "../../Components/ErrorModal/ErrorModal";
import { AuthContext } from "../../Hooks/AuthProvider";

export const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  const navigate = useNavigate();

  return (
    <>
      <div className={LoginCSS["ASL-main-container"]}>
        <ErrorModal
          message={error}
          show={error !== ""}
          onClose={() => setError("")}
        />
        <div className={LoginCSS["ASL-secondary-container"]}>
          <div className={LoginCSS["ASL-form-container"]}>
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              validationSchema={Yup.object({
                username: Yup.string().required("Username is required"),
                password: Yup.string().required("Password is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                axios
                  .post(
                    "https://localhost:7124/api/UserAuth/login",
                    {
                      username: values.username,
                      password: values.password,
                    },
                    { withCredentials: true }
                  )

                  .then((response) => {
                    console.log(response);

                    if (response.status === 200) {
                      const { user, token } = response.data;
                      login(user, token);
                      navigate("/");
                    }
                  })
                  .catch((error) => {
                    if (
                      error.response &&
                      error.response.data &&
                      error.response.data.message
                    ) {
                      setError(error.response.data.message);
                    } else {
                      setError(error.message);
                    }
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
            >
              {({ isSubmitting }) => (
                <Form className={LoginCSS["ASL-form"]}>
                  <h1 className={LoginCSS["ASL-header"]}>Login</h1>
                  <div className={LoginCSS["ASL-field-container"]}>
                    <ErrorMessage
                      name="username"
                      component="p"
                      className={LoginCSS["ASL-validation"]}
                    />
                    <Field
                      placeholder="Username"
                      className={LoginCSS["ASL-field"]}
                      type="text"
                      id="username"
                      name="username"
                      required
                    />
                  </div>
                  <div className={LoginCSS["ASL-field-container"]}>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className={LoginCSS["ASL-validation"]}
                    />
                    <div className={LoginCSS["ASL-field-password"]}>
                      <Field
                        placeholder="Password"
                        className={LoginCSS["ASL-field"]}
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                      />
                      <span
                        className={LoginCSS["ASL-password-toggle"]}
                        onClick={togglePasswordVisibility}
                      >
                        <i
                          className={`fas ${
                            passwordVisible ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={LoginCSS["ASL-login-btn"]}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      "Login"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          <div className={LoginCSS["ASL-image-container"]}>
            <img
              src={require("../../Assets/CarLoginImage.png")}
              alt="LoginCar"
            />
          </div>
        </div>
      </div>
    </>
  );
};
