import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import {
  Fields,
  PasswordFields,
} from "../../../../../Components/Fields/Fields";
import InsertModalUserCSS from "./InsertModalUser.module.css";
import axios from "axios";

// User Insert/Update Modal component
export const IUModalUser = (props) => {
  const {
    show,
    handleClose,
    setSuccess,
    setError,
    setUsers,
    users,
    modalType,
    updateID,
    selectedUser,
    setShowError,
  } = props;

  // Role Filtering Options
  const roleOptions = [
    { key: "Select an option", value: "" },
    { key: "Staff", value: "Staff" },
    { key: "Admin", value: "Admin" },
  ];
  // Loading state
  const [loading, setLoading] = useState(false);
  // Host environment variable
  const host = process.env.REACT_APP_API_HOST;

  // Validation schema for formik
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    username: Yup.string()
      .required("username is required")
      .matches(/^[a-zA-Z0-9]+$/, "Username cant contain spaces"),
    email: Yup.string()
      .email("Invalid email address") // ensure a valid email
      .required("Email is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
        "Invalid email format"
      ), // ensure it is required
    ...(modalType === "Insert"
      ? {
          password: Yup.string()
            .required("password is required")
            .min(6, "6+ char password required.")
            .matches(/^(?=.*\d)/, "Password needs at least 1 number"),
        }
      : {}),

    role: Yup.string().required("Role is required"),
    phoneNumber: Yup.string()
      .required("Contact number is required")
      .test(
        "isNumeric",
        "Contact should not contain alphabetical characters",
        (value) => {
          return /^[0-9]+$/.test(value);
        }
      )
      .test("length", "Contact should be 10 digits", (value) => {
        return value && value.length === 10;
      }),
    address: Yup.string().required("address is required"),
  });

  // Handle formik submit
  const formRef = useRef();
  const handleInsertFormik = () => {
    formRef.current.submitForm();
    handleInsertUpdate();
  };

  // Handle Insert/Update
  const handleInsertUpdate = async (values) => {
    try {
      setLoading(true);
      const fieldData = {
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        role: values.role,
        phoneNumber: values.phoneNumber,
        address: values.address,
      };

      if (modalType === "Insert") {
        fieldData.password = values.password;
      } else if (modalType === "Update") {
        fieldData.id = updateID;
      }

      const endpoint =
        modalType === "Insert"
          ? `${host}/api/Admin/add_staff`
          : `${host}/api/Admin/update_user`;
      const response = await axios({
        method: modalType === "Insert" ? "post" : "put",
        url: endpoint,
        data: fieldData,
        withCredentials: true,
      });

      if (response.status === 200 && modalType === "Insert") {
        setSuccess(values.username + " added successfully");
        formRef.current.resetForm();
        setUsers([...users, response.data.staffMember]);
        handleClose();
      }

      if (response.status === 200 && modalType === "Update") {
        setSuccess(values.username + " updated successfully");
        handleClose();
        const updatedUsers = users.map((user) => {
          if (user.id === updateID) {
            return { ...response.data.staff };
          } else {
            return user;
          }
        });
        setUsers(updatedUsers);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setShowError(true);
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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === "Insert" ? "Insert New User" : "Update User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={formRef}
          initialValues={{
            fullName: selectedUser.fullName || "",
            username: selectedUser?.username || "",
            email: selectedUser?.email || "",
            ...(modalType === "Insert" ? { password: "" } : {}),
            role: selectedUser?.role || "",
            phoneNumber: selectedUser?.phoneNumber || "",
            address: selectedUser?.address || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleInsertUpdate}
        >
          {() => (
            <Form className={InsertModalUserCSS["IM-form"]}>
              <div className={InsertModalUserCSS["IM-form-sections"]}>
                <Fields
                  fieldLabel="Full Name"
                  fieldName="fullName"
                  fieldPlaceholder="Full Name"
                />

                <Fields
                  fieldLabel="Email"
                  fieldName="email"
                  fieldPlaceholder="Email"
                  fieldType="email"
                />

                <Fields
                  fieldLabel="Phone Number"
                  fieldName="phoneNumber"
                  fieldPlaceholder="Phone Number"
                />
                <Fields
                  fieldLabel="Role"
                  fieldName="role"
                  fieldType="text"
                  fieldAs="select"
                  option={roleOptions}
                />
              </div>
              <div className={InsertModalUserCSS["IM-form-sections"]}>
                <Fields
                  fieldLabel="Username"
                  fieldName="username"
                  fieldPlaceholder="Username"
                />
                {modalType === "Insert" && (
                  <PasswordFields
                    fieldLabel="Password"
                    fieldName="password"
                    fieldPlaceholder="password"
                  />
                )}
                <Fields
                  fieldLabel="Address"
                  fieldName="address"
                  fieldPlaceholder="Address"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleInsertFormik}
          disabled={loading}
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : modalType}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ChangePasswordModal = (props) => {
  const { show, handleClose, setSuccess, setError, userId, setShowError } =
    props;
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const host = process.env.REACT_APP_API_HOST;

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "6+ char password required.")
      .matches(/^(?=.*\d)/, "password needs 1 number")
      .required("password is required"),
  });

  const handleInsertFormik = () => {
    formRef.current.submitForm();
    handleInsertUpdate();
  };

  const handleInsertUpdate = async (values) => {
    try {
      const fieldData = {
        userId: userId,
        newPassword: values.newPassword,
      };
      setLoading(true);

      const endpoint = `${host}/api/Admin/change_password`;
      const response = await axios({
        method: "post",
        url: endpoint,
        data: fieldData,
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess("Password Changed successfully");
        formRef.current.resetForm();
        handleClose();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setShowError(true);
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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={formRef}
          initialValues={{
            newPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleInsertUpdate}
        >
          {() => (
            <Form className={InsertModalUserCSS["IM-form"]}>
              <div className={InsertModalUserCSS["IM-form-sections"]}>
                <PasswordFields
                  fieldLabel="New Password"
                  fieldName="newPassword"
                  fieldPlaceholder="password"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="primary"
          onClick={handleInsertFormik}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            "Change Password"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
