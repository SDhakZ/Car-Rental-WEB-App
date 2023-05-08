import React, { useState, useRef } from "react";
import DamageReportModalCSS from "./DamageReportModal.module.css";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Fields } from "../../../Components/Fields/Fields";

export const DamageReportModal = (props) => {
  const validationSchema = Yup.object().shape({
    description: Yup.string().required("Description cannot be empty."),
  });
  const {
    show,
    handleClose,
    setSuccess,
    setError,
    setOpenModal,
    carName,
    carBrand,
    rentalId,
    image,
  } = props;
  const host = process.env.REACT_APP_API_HOST;
  const [description, setDesciption] = useState("");
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleReportFormik = () => {
    formRef.current.submitForm();
  };

  const handleReport = async () => {
    setLoading(true);
    try {
      const fieldData = {
        rentalId: rentalId,
        damageDescription: description,
      };
      const response = await axios({
        method: "post",
        url: `${host}/api/DamageRequest/make_request`,
        data: fieldData,
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess("Damage Reported successfully.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
      } else {
        setError(error.message);
      }
    } finally {
      setOpenModal(false);
      setLoading(false);
    }
  };
  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header style={{ padding: "0px" }}>
          <p className={DamageReportModalCSS["DRM-title"]}>Report Damages</p>
        </Modal.Header>
        <Modal.Body>
          <Formik
            innerRef={formRef}
            initialValues={{ description: "" }}
            validationSchema={validationSchema}
            onSubmit={handleReport}
          >
            {({ values, setFieldValue }) => {
              setDesciption(values.description);
              return (
                <Form className={DamageReportModalCSS["DRM-form"]}>
                  <div className={DamageReportModalCSS["DRM-image-cardetail"]}>
                    <img
                      className={DamageReportModalCSS["DRM-image"]}
                      src={image}
                      alt="car"
                    />
                    <div className={DamageReportModalCSS["DRM-cardetail"]}>
                      <div className={DamageReportModalCSS["DRM-name"]}>
                        {carName}
                      </div>
                      <div className={DamageReportModalCSS["DRM-brand"]}>
                        {carBrand}
                      </div>
                    </div>
                  </div>
                  <Fields
                    fieldType="text"
                    fieldLabel="Description"
                    fieldAs="textarea"
                    fieldPlaceholder="Descrbe the damages done to the car."
                    fieldName="description"
                    setFieldValue={setFieldValue}
                    values={values}
                  />
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
            onClick={handleReportFormik}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "Send Report"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
