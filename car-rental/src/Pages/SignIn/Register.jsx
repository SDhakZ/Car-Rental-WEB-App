import React, { useState, useRef } from "react";
import SignInCSS from "./SignIn.module.css";
import axios from "axios";
import { ErrorModal } from "../../Components/ErrorModal/ErrorModal";
import { SuccessModal } from "../../Components/SuccessModal/SuccessModal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Register = (props) => {
  const { setActive } = props;
  const host = process.env.REACT_APP_API_HOST;
  const [registerpasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [citizenshipLicense, setCitizenshipLicense] = useState("citizenship");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formikRef = useRef();
  const handleCitizenshipLicenseChange = (event) => {
    setCitizenshipLicense(event.target.value);
  };

  const toggleRegisterPasswordVisibility = () => {
    setRegisterPasswordVisible((prevState) => !prevState);
  };

  const RegisterSchema = Yup.object().shape({
    register_fullname: Yup.string().required("Full name is required"),
    register_username: Yup.string().required("Username is required"),
    register_email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email format'),
    register_password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/^(?=.*\d)/, "Password must contain at least one number")
      .required("Password is required"),
    register_contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Contact should be 10 digits")
      .required("Contact number is required"),
    register_address: Yup.string().required("Address is required"),
  });

  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName("");
      setFileName(file.name);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {

      const formData = new FormData();
      formData.append("FullName", values.register_fullname);
      formData.append("Username", values.register_username);
      formData.append("Email", values.register_email);
      formData.append("Password", values.register_password);
      formData.append("PhoneNumber", values.register_contact);
      formData.append("Address", values.register_address);
      formData.append("Document", selectedFile);
      formData.append("DocType", citizenshipLicense);

      const response = await axios.post(
        `${host}/api/UserAuth/register_customer`,
        formData
      );

      if (response.status === 200) {
        formikRef.current.resetForm();
        setSuccess("Registration successful");
        setActive("login");
        setSelectedFile(null);
        setFileName("");
        window.scrollTo(0, 0);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setError(error.response.data.message);
        } else if (
          error.response.data[0] &&
          error.response.data[0].description
        ) {
          setError(error.response.data[0].description);
        } else if (error.response.data) {
          setError(error.response.data);
        } else {
          setError(error.message);
        }
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
      <SuccessModal
        message={success}
        show={success !== ""}
        onClose={() => setSuccess("")}
      />
      <div className={SignInCSS["USI-register-htm"]}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            register_fullname: "",
            register_username: "",
            register_email: "",
            register_password: "",
            register_contact: "",
            register_address: "",
            citizenshipLicense: null,
            citizenshipLicenseType: "citizenship",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={SignInCSS["USI-group"]}>
                <label
                  htmlFor="register_fullname"
                  className={SignInCSS["USI-label"]}
                >
                  Full Name
                </label>
                <Field
                  id="register_fullname"
                  type="text"
                  className={SignInCSS["USI-input"]}
                  placeholder="Type your Full name"
                  name="register_fullname"
                />
                <ErrorMessage
                  name="register_fullname"
                  component="p"
                  className={SignInCSS["USI-error"]}
                />
              </div>
              <div className={SignInCSS["USI-group"]}>
                <label
                  htmlFor="register_username"
                  className={SignInCSS["USI-label"]}
                >
                  Username
                </label>
                <Field
                  type="text"
                  className={SignInCSS["USI-input"]}
                  placeholder="Type your username"
                  id="register_username"
                  name="register_username"
                />
                <ErrorMessage
                  name="register_username"
                  component="p"
                  className={SignInCSS["USI-error"]}
                />
              </div>

              <div className={SignInCSS["USI-group"]}>
                <label
                  htmlFor="register_email"
                  className={SignInCSS["USI-label"]}
                >
                  Email
                </label>
                <Field
                  type="register_email"
                  className={SignInCSS["USI-input"]}
                  placeholder="Type your email"
                  name="register_email"
                />
                <ErrorMessage
                  name="register_email"
                  component="p"
                  className={SignInCSS["USI-error"]}
                />
              </div>

              <div className={SignInCSS["USI-group"]}>
                <label
                  htmlFor="register-pass"
                  className={SignInCSS["USI-label"]}
                >
                  Password
                </label>
                <div className={SignInCSS["USI-password"]}>
                  <Field
                    id="register_password"
                    type={registerpasswordVisible ? "text" : "password"}
                    className={SignInCSS["USI-input"]}
                    placeholder="Type your password"
                    name="register_password"
                  />
                  <span
                    className={SignInCSS["USI-password-toggle"]}
                    onClick={toggleRegisterPasswordVisibility}
                  >
                    <i
                      className={`fas ${registerpasswordVisible ? "fa-eye-slash" : "fa-eye"
                        }`}
                    ></i>
                  </span>
                </div>
                <ErrorMessage
                  name="register_password"
                  component="p"
                  className={SignInCSS["USI-error"]}
                />
              </div>

              <div className={SignInCSS["USI-group"]}>
                <label htmlFor="contact" className={SignInCSS["USI-label"]}>
                  Contact Number
                </label>
                <Field
                  id="register_contact"
                  type="text"
                  className={SignInCSS["USI-input"]}
                  placeholder="Type your contact number"
                  name="register_contact"
                />
                <ErrorMessage
                  name="register_contact"
                  component="p"
                  className={SignInCSS["USI-error"]}
                />
              </div>
              <div className={SignInCSS["USI-group"]}>
                <label htmlFor="contact" className={SignInCSS["USI-label"]}>
                  Address
                </label>
                <Field
                  id="register_address"
                  type="text"
                  className={SignInCSS["USI-input"]}
                  placeholder="Type your address"
                  name="register_address"
                />
                <ErrorMessage
                  name="register_address"
                  component="p"
                  className={SignInCSS["USI-error"]}
                />
              </div>
              <div>
                <div className={SignInCSS["USI-addGroup-radio"]}>
                  <label htmlFor="pass" className={SignInCSS["USI-label"]}>
                    Add a citizenship / license <span>(Optional)</span>
                  </label>
                  <label
                    htmlFor="inputTag"
                    className={SignInCSS["USI-uploadImage"]}
                  >
                    Upload Image
                    <input
                      accept="application/pdf,image/png"
                      type="file"
                      key={fileName} // Add a key prop that changes when fileName changes
                      onChange={handleFileSelected}
                      id="inputTag"
                      className={SignInCSS["USI-selectFile"]}
                    />
                  </label>
                </div>
                <div className={SignInCSS["USI-radio-file"]}>
                  <div className={SignInCSS["USI-radio-group"]}>
                    <label className={SignInCSS["USI-radio"]}>
                      <input
                        type="radio"
                        name="citizenship-license"
                        value="citizenship"
                        onChange={handleCitizenshipLicenseChange}
                        checked={citizenshipLicense === "citizenship"}
                      />
                      &nbsp; Citizenship
                    </label>
                    <label className={SignInCSS["USI-radio"]}>
                      <input
                        type="radio"
                        name="citizenship-license"
                        value="license"
                        onChange={handleCitizenshipLicenseChange}
                        checked={citizenshipLicense === "license"}
                      />
                      &nbsp; License
                    </label>
                  </div>

                  {fileName && (
                    <div className={SignInCSS["USI-file-group"]}>
                      <button
                        title="Remove picture"
                        onClick={() => {
                          setSelectedFile(null);
                          setFileName("");
                        }}
                        className={SignInCSS["USI-remove-file"]}
                      >
                        <i className={`${SignInCSS.fileCross} fa fa-close`}></i>
                      </button>
                      <label className={SignInCSS["USI-file-name"]}>
                        {fileName}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={SignInCSS["USI-button"]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Register"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
