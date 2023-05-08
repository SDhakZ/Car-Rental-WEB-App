import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Fields } from "../../../../../Components/Fields/Fields";
import DamageModalCSS from "./DamageModalCSS.module.css";
import axios from "axios";

export const DamageModal = (props) => {
  const {
    show,
    handleClose,
    setSuccess,
    setError,
    damageRequests,
    setDamageRequests,
    requestId,
  } = props;
  const host = process.env.REACT_APP_API_HOST;
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .min(0, "Rate per day cannot be negative")
      .required("Damage Amount is required"),
  });

  const formRef = useRef();
  const handleInsertFormik = () => {
    formRef.current.submitForm();
    handleAmountSend();
  };

  const handleAmountSend = async (values) => {
    try {
      setLoading(true);
      const fieldData = {
        amount: values.amount,
        damageRecordId: requestId,
      };

      const endpoint = `${host}/api/DamagePayment/create_bill`;

      const response = await axios({
        method: "post",
        url: endpoint,
        data: fieldData,
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess("Bill sent successfully");
        const updatedDamageRequests = damageRequests.filter((request) => {
          return request.id !== requestId;
        });
        setDamageRequests(updatedDamageRequests);

        handleClose();
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
        <Modal.Title>Send Damage Bill Amount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={formRef}
          initialValues={{
            amount: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAmountSend}
        >
          {() => (
            <Form className={DamageModalCSS["DMM-form"]}>
              <div className={DamageModalCSS["DMM-form-sections"]}>
                <Fields
                  fieldLabel="Amount"
                  fieldName="amount"
                  fieldPlaceholder="Amount"
                  fieldType="number"
                  min="0"
                  onKeyPress={(e) => {
                    if (e.key === "-" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
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
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "Send"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
