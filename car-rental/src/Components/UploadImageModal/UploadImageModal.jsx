import React, { useState, useRef, useContext } from "react";
import UploadImageModalCSS from "./UploadImageModal.module.css";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../Hooks/AuthContext";
import axios from "axios";

export const UploadImageModal = (props) => {
  const host = process.env.REACT_APP_API_HOST;
  const [loading, setLoading] = useState(false);
  const {
    show,
    setOpenModal,
    handleClose,
    setHasDocument,
    setSuccess,
    setError,
  } = props;
  const { user } = useContext(AuthContext);
  const userId = user && user.id ? user.id : null;
  const [citizenshipLicense, setCitizenshipLicense] = useState("citizenship");
  const formRef = useRef();

  const validationSchema = Yup.object().shape({
    Image: Yup.mixed().required("Image is required"),
  });

  const handleCitizenshipLicenseChange = (event) => {
    setCitizenshipLicense(event.target.value);
  };

  const handleUploadFormik = () => {
    formRef.current.submitForm();
    handleUploadImage();
  };

  const handleUploadImage = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("UserId", userId);
      formData.append("Document", values.Image);
      formData.append("DocType", citizenshipLicense);

      const response = await axios({
        method: "post",
        url: `${host}/api/UserAuth/upload_doc`,
        data: formData,
        withCredentials: true,
      });
      if (response.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            hasDocument: true,
          })
        );
        setSuccess("Document uploaded successfully");
        setOpenModal(false);
        setHasDocument(true);
      }
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.message) {
          setError(error.response.message);
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
    <>
      <Modal size="" show={show} onHide={handleClose}>
        <Modal.Header style={{ padding: "0px" }}>
          <p className={UploadImageModalCSS["UPM-title"]}>Upload Image</p>
        </Modal.Header>

        <Modal.Body>
          <Formik
            innerRef={formRef}
            initialValues={{
              Image: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleUploadImage}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form className={UploadImageModalCSS["UPM-form"]}>
                  <div className={UploadImageModalCSS["UPM-addGroup-radio"]}>
                    <label
                      htmlFor="pass"
                      className={UploadImageModalCSS["UPM-label"]}
                    >
                      Add a citizenship / license
                    </label>
                    <div className={UploadImageModalCSS["UPM-radio-file"]}>
                      <div className={UploadImageModalCSS["UPM-radio-group"]}>
                        <label className={UploadImageModalCSS["UPM-radio"]}>
                          <input
                            type="radio"
                            name="citizenship-license"
                            value="citizenship"
                            onChange={handleCitizenshipLicenseChange}
                            checked={citizenshipLicense === "citizenship"}
                          />
                          &nbsp; Citizenship
                        </label>
                        <label className={UploadImageModalCSS["UPM-radio"]}>
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
                    </div>
                  </div>
                  <div className={UploadImageModalCSS["UPM-error-upload"]}>
                    <ErrorMessage
                      name="Image"
                      component="p"
                      className={UploadImageModalCSS["UPM-validation"]}
                    />
                    <label
                      htmlFor="Image"
                      className={UploadImageModalCSS["UPM-uploadImage"]}
                    >
                      Add Document
                      <input
                        accept="application/pdf,image/png"
                        type="file"
                        onChange={(event) => {
                          setFieldValue("Image", event.target.files[0]);
                        }}
                        id="Image"
                        name="Image"
                        className={UploadImageModalCSS["UPM-selectFile"]}
                      />
                    </label>
                    {values.Image && (
                      <div className={UploadImageModalCSS["UPM-file-group"]}>
                        <button
                          title="Remove picture"
                          onClick={() => {
                            setFieldValue("Image", null);
                          }}
                          className={UploadImageModalCSS["UPM-remove-file"]}
                        >
                          <i
                            className={`${UploadImageModalCSS.fileCross} fa fa-close`}
                          ></i>
                        </button>
                        <label className={UploadImageModalCSS["UPM-file-name"]}>
                          {values.Image ? values.Image.name : ""}
                        </label>
                      </div>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            disabled={loading}
            variant="primary"
            onClick={handleUploadFormik}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "Upload Image"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
