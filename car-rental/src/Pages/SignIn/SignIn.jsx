import React, { useState, useContext } from "react";
import SignInCSS from "./SignIn.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../../Components/ErrorModal/ErrorModal";
import { Register } from "./Register";
import { AuthContext } from "../../Hooks/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const SignIn = () => {
  const host = process.env.REACT_APP_API_HOST;
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [active, setActive] = useState("login");
  const [loginpasswordVisible, setLoginPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const toggleLoginPasswordVisibility = () => {
    setLoginPasswordVisible((prevState) => !prevState);
  };

  const loginSchema = Yup.object().shape({
    login_username: Yup.string().required("Username is required"),
    login_password: Yup.string().required("Password is required"),
  });

  const initialValues = {
    login_username: "",
    login_password: "",
  };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${host}/api/UserAuth/login`,
        {
          username: values.login_username,
          password: values.login_password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        login(user, token);
        window.scrollTo({ top: 0 });
        navigate("/");
      }
      if (response.status === 401) {
        navigate("Test");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ErrorModal
        message={error}
        show={error !== ""}
        onClose={() => setError("")}
      />

      <div className={SignInCSS["USI-main-container"]}>
        {active === "login" ? (
          <img
            className={`${SignInCSS["USI-img"]} ${
              active === "login" ? SignInCSS["USI-img-active"] : ""
            }`}
            src={require("../../Assets/Login.png")}
            alt="DownhillCar"
          />
        ) : (
          <img
            className={`${SignInCSS["USI-img2"]} ${
              active === "register" ? SignInCSS["USI-img-active"] : ""
            }`}
            src={require("../../Assets/Register.png")}
            alt="UphillCar"
          />
        )}

        {/* Login and Register Submenu*/}
        <div className={SignInCSS["USI-secondary-container"]}>
          <div className={SignInCSS["USI-login-html"]}>
            <input
              id="login"
              type="radio"
              name="login"
              className={SignInCSS["USI-login"]}
              checked={active === "login" ? true : false}
              onChange={() => setActive("login")}
            />
            <label htmlFor="login" className={SignInCSS["USI-tab"]}>
              Login
            </label>
            <input
              id="tab-2"
              type="radio"
              name="register"
              className={SignInCSS["USI-register"]}
              checked={active === "register" ? true : false}
              onChange={() => setActive("register")}
            />
            <label htmlFor="tab-2" className={SignInCSS["USI-tab"]}>
              REGISTER
            </label>
            {/* Login and Register Submenu END*/}
            {/* -------------------- Login ---------------- */}
            <div className={SignInCSS["USI-login-form"]}>
              <div className={SignInCSS["USI-login-htm"]}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={loginSchema}
                  onSubmit={handleLoginSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className={SignInCSS["USI-group"]}>
                        <label
                          htmlFor="login_username"
                          className={SignInCSS["USI-label"]}
                        >
                          Username
                        </label>
                        <Field
                          id="login_username"
                          type="text"
                          name="login_username"
                          className={SignInCSS["USI-input"]}
                          placeholder="Type your username"
                        />
                        <ErrorMessage
                          name="login_username"
                          component="p"
                          className={SignInCSS["USI-error"]}
                        />
                      </div>

                      <div className={SignInCSS["USI-group"]}>
                        <label
                          htmlFor="login_password"
                          className={SignInCSS["USI-label"]}
                        >
                          Password
                        </label>
                        <div className={SignInCSS["USI-password"]}>
                          <Field
                            id="login_password"
                            type={loginpasswordVisible ? "text" : "password"}
                            name="login_password"
                            className={SignInCSS["USI-input"]}
                            placeholder="Type your password"
                          />
                          <span
                            className={SignInCSS["USI-password-toggle"]}
                            onClick={toggleLoginPasswordVisibility}
                          >
                            <i
                              className={`fas ${
                                loginpasswordVisible ? "fa-eye-slash" : "fa-eye"
                              }`}
                            ></i>
                          </span>
                        </div>
                        <ErrorMessage
                          name="login_password"
                          component="p"
                          className={SignInCSS["USI-error"]}
                        />
                      </div>

                      <button
                        type="submit"
                        className={SignInCSS["USI-button"]}
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
              <Register setActive={setActive} />
            </div>
            {/* -------------------- Login End ---------------- */}
          </div>
        </div>
      </div>
    </>
  );
};
