import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import { DatePickerNoMods } from "../../../../../Components/Fields/Fields";
import ReturnModalCSS from "./ReturnModal.module.css";
import axios from "axios";

export const ReturnModal = (props) => {
  const {
    show,
    handleClose,
    setSuccess,
    setError,
    returnCar,
    setReturnCar,
    requestId,
  } = props;
  const host = process.env.REACT_APP_API_HOST;
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    returnDate: Yup.date().nullable().required("Return date is required"),
  });

  const formRef = useRef();
  const handleInsertFormik = () => {
    formRef.current.submitForm();
    handleAmountSend();
  };

  const handleAmountSend = async (values) => {
    try {
      setLoading(true);
      const formattedReturnDate = values.returnDate
        ? new Date(values.returnDate).toLocaleDateString("en-US", {
            timeZone: "Asia/Kathmandu",
          })
        : null;
      const fieldData = {
        rentalId: requestId,
        returnDate: formattedReturnDate,
      };

      const endpoint = `${host}/api/RentalHistory/return_car`;

      const response = await axios({
        method: "put",
        url: endpoint,
        data: fieldData,
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess("Car returned successfully");
        handleClose();
        const updatedDamageRequests = returnCar.filter(
          (request) => request.id !== requestId
        );
        setReturnCar(updatedDamageRequests);
      }
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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Return Car?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={formRef}
          initialValues={{
            returnDate: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAmountSend}
        >
          {({ values, setFieldValue }) => (
            <Form className={ReturnModalCSS["DMM-form"]}>
              <div className={ReturnModalCSS["DMM-form-sections"]}>
                <DatePickerNoMods
                  fieldLabel="Return Date"
                  fieldName="returnDate"
                  fieldPlaceholder="Return Date"
                  setFieldValue={setFieldValue}
                  values={values}
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
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "Return"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
