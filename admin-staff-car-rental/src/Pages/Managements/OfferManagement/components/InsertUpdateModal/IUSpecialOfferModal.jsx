import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import {
  Fields,
  DatePickerField,
  SelectField,
} from "../../../../../Components/Fields/Fields";
import InsertModalUserCSS from "./IUSOM.module.css";
import axios from "axios";

export const IUSpecialOfferModal = (props) => {
  const {
    show,
    handleClose,
    setSuccess,
    setError,
    setOffers,
    offers,
    modalType,
    updateID,
    selectedOffer,
  } = props;
  const host = process.env.REACT_APP_API_HOST;
  const [carData, setCarData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropLoading, setDropLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  useEffect(() => {
    setSelectedCar(
      carData.find((car) => car.value === (selectedOffer?.carId || ""))
    );
  }, [carData, selectedOffer]);

  const fetchCarData = async () => {
    try {
      setDropLoading(true);
      const response = await axios({
        method: "get",
        url: `${host}/api/SpecialOffers/view_cars`,
        withCredentials: true,
      });

      if (response.status === 200) {
        setDropLoading(false);
      }
      const options = response.data.cars.map((car) => ({
        value: car.id,
        label: car.name,
      }));
      setCarData(options);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCarData();
  }, []);

  const handleSearch = (inputValue) => {
    const filteredResults = carData.filter((car) =>
      car.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const validationSchema = Yup.object().shape({
    offerTitle: Yup.string().required("Offer title is required"),
    offerDescription: Yup.string()
      .min(5, "Offer description must be at least 5 characters")
      .max(200, "Offer description cannot exceed 200 characters")
      .required("Offer description is required"),
    discount: Yup.number()
      .min(1, "Discount must be at least 1")
      .max(90, "Discount cannot exceed 90")
      .required("Discount is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
    carId: Yup.string().required("Car ID is required"),
  });

  const formRef = useRef();
  const handleInsertFormik = () => {
    formRef.current.submitForm();
    handleInsertUpdate();
  };

  const handleInsertUpdate = async (values) => {
    console.log(values.carId);
    try {
      setLoading(true);
      const formattedStartDate = values.startDate
        ? new Date(values.startDate).toLocaleDateString("en-US", {
            timeZone: "Asia/Kathmandu",
          })
        : null;
      const formattedEndDate = values.endDate
        ? new Date(values.endDate).toLocaleDateString("en-US", {
            timeZone: "Asia/Kathmandu",
          })
        : null;

      const fieldData = {
        offerTitle: values.offerTitle,
        offerDescription: values.offerDescription,
        discount: values.discount,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        carId: values.carId,
      };

      if (modalType === "Update") {
        fieldData.id = updateID;
      }

      const endpoint =
        modalType === "Insert"
          ? `${host}/api/SpecialOffers/add_offer`
          : `${host}/api/SpecialOffers/update_offer`;
      const response = await axios({
        method: modalType === "Insert" ? "post" : "patch",
        url: endpoint,
        data: fieldData,
        withCredentials: true,
      });

      if (response.status === 200 && modalType === "Insert") {
        setSuccess(values.offerTitle + " added successfully");
        formRef.current.resetForm();
        setOffers([...offers, response.data.offer]);
        console.log(offers);
        handleClose();
      }
      if (response.status === 200 && modalType === "Update") {
        setSuccess(values.offerTitle + " updated successfully");
        handleClose();
        const updatedOffer = offers.map((offer) => {
          if (offer.id === updateID) {
            return { ...response.data.offer };
          } else {
            return offer;
          }
        });
        setOffers(updatedOffer);
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
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === "Insert"
            ? "Insert Special Offer"
            : "Update Special Offer"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={formRef}
          initialValues={{
            offerTitle: selectedOffer?.offerTitle || "",
            offerDescription: selectedOffer?.offerDescription || "",
            discount: selectedOffer?.discount || "",
            startDate: selectedOffer?.startDate || "",
            endDate: selectedOffer?.endDate || "",
            carId: selectedOffer?.carId || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleInsertUpdate}
        >
          {({ values, setFieldValue }) => (
            <Form className={InsertModalUserCSS["IMSO-form"]}>
              <div className={InsertModalUserCSS["IMSO-form-sections"]}>
                <Fields
                  fieldLabel="Offer Title"
                  fieldName="offerTitle"
                  fieldPlaceholder="Title"
                />
                <SelectField
                  fieldLabel="Car Name"
                  fieldName="carId"
                  fieldPlaceholder="Car"
                  handleSearch={handleSearch}
                  setFieldValue={setFieldValue}
                  selectedValue={selectedCar}
                  setSelectedValue={setSelectedCar}
                  dropLoading={dropLoading}
                  carData={carData}
                />
                <DatePickerField
                  fieldLabel="Start Date"
                  fieldName="startDate"
                  fieldPlaceholder="Start Date"
                  setFieldValue={setFieldValue}
                  values={values}
                  modalType={modalType}
                />

                <Fields
                  fieldLabel="Discount"
                  fieldName="discount"
                  fieldPlaceholder="Discount"
                  fieldType="number"
                  min="1"
                  max="90"
                  onKeyPress={(e) => {
                    if (e.key === "-" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className={InsertModalUserCSS["IMSO-form-sections"]}>
                <Fields
                  fieldLabel="Description"
                  fieldName="offerDescription"
                  fieldPlaceholder="Offer Description"
                  fieldType="text"
                  fieldAs="textarea"
                />
                <DatePickerField
                  fieldLabel="End Date"
                  fieldName="endDate"
                  fieldPlaceholder="End Date"
                  setFieldValue={setFieldValue}
                  values={values}
                  modalType={modalType}
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
          {loading ? <i className="fas fa-spinner fa-spin"></i> : modalType}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
