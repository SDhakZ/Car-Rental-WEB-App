import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Fields, ImageField } from "../../../../../Components/Fields/Fields";
import InsertModalCSS from "./InsertModal.module.css";
import axios from "axios";

export const IUModal = (props) => {
  const {
    show,
    handleClose,
    setSuccess,
    setError,
    setCars,
    cars,
    modalType,
    updateID,
    selectedCar,
    setShowErrorPage,
  } = props;
  const [imageUrlShown, setImageUrlShown] = useState(false);

  const formRef = useRef();
  const fuelTypeOptions = [
    { key: "Select an option", value: "" },
    { key: "Petrol", value: "Petrol" },
    { key: "Diesel", value: "Diesel" },
    { key: "Electric", value: "Electric" },
    { key: "Hybrid", value: "Hybrid" },
  ];

  const safetyRatingOptions = [
    { key: "Select an option", value: "" },
    { key: "A", value: "A" },
    { key: "B", value: "B" },
    { key: "C", value: "C" },
    { key: "D", value: "D" },
    { key: "E", value: "E" },
  ];
  const [loading, setLoading] = useState(false);

  const host = process.env.REACT_APP_API_HOST;

  const validationSchema = Yup.object().shape({
    CarName: Yup.string().required("Car Name is required"),
    Brand: Yup.string().required("Brand Name is required"),
    Mileage: Yup.string().required("Mileage is required"),
    Color: Yup.string().required("Color is required"),
    FuelType: Yup.string().required("Fuel Type is required"),
    RatePerDay: Yup.number()
      .min(0, "Rate per day cannot be negative")
      .required("Rate Per Day is required"),
    Description: Yup.string()
      .min(10, "Min characters 10")
      .max(500, "Max characters 500")
      .required("Description is required"),
    SafetyRating: Yup.string().required("Safety Rating is required"),
    CarImage:
      imageUrlShown === false
        ? Yup.mixed().required("Image is required")
        : Yup.mixed(),
  });

  const handleInsertFormik = () => {
    formRef.current.submitForm();
    handleInsertUpdate();
  };

  const handleInsertUpdate = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      modalType === "Update" && formData.append("Id", updateID);
      formData.append("CarName", values.CarName);
      formData.append("Brand", values.Brand);
      formData.append("Mileage", values.Mileage);
      formData.append("Color", values.Color);
      formData.append("FuelType", values.FuelType);
      formData.append("RatePerDay", values.RatePerDay);
      formData.append("Description", values.Description);
      formData.append("SafetyRating", values.SafetyRating);
      formData.append("Image", values.CarImage);
      const endpoint =
        modalType === "Insert"
          ? `${host}/api/Car/add_car`
          : `${host}/api/Car/update_car?Id=${updateID}`;
      const response = await axios({
        method: modalType === "Insert" ? "post" : "patch",
        url: endpoint,
        data: formData,
        withCredentials: true,
      });
      console.log(response.data.car);
      if (response.status === 200 && modalType === "Insert") {
        setSuccess(values.CarName + " added successfully");
        formRef.current.resetForm();
        setCars([...cars, response.data.car]);
        console.log(cars);
        handleClose();
      }
      if (response.status === 200 && modalType === "Update") {
        setSuccess(values.CarName + " updated successfully");
        handleClose();
        const updatedCars = cars.map((car) => {
          if (car.id === updateID) {
            return { ...response.data.car };
          } else {
            return car;
          }
        });
        setCars(updatedCars);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setShowErrorPage(true);
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
          {modalType === "Insert" ? "Insert New Car" : "Update Car"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          innerRef={formRef}
          initialValues={{
            CarName: selectedCar?.carName || "",
            Brand: selectedCar?.brand || "",
            Mileage: selectedCar?.mileage || "",
            Color: selectedCar?.color || "",
            FuelType: selectedCar?.fuelType || "",
            RatePerDay: selectedCar?.ratePerDay || "",
            Description: selectedCar?.description || "",
            SafetyRating: selectedCar?.safetyRating || "",
            CarImage: modalType === "Update" ? "" : null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleInsertUpdate}
        >
          {({ values, setFieldValue }) => (
            <Form className={InsertModalCSS["IM-form"]}>
              <div className={InsertModalCSS["IM-form-sections"]}>
                <Fields
                  fieldLabel="Car Name"
                  fieldName="CarName"
                  fieldPlaceholder="Car Name"
                />

                <Fields
                  fieldLabel="Brand Name"
                  fieldName="Brand"
                  fieldPlaceholder="Brand"
                />

                <Fields
                  fieldLabel="Mileage"
                  fieldName="Mileage"
                  fieldPlaceholder="Mileage"
                  fieldType="number"
                  min="0"
                  onKeyPress={(e) => {
                    if (e.key === "-" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                />
                <Fields
                  fieldLabel="FuelType"
                  fieldName="FuelType"
                  fieldPlaceholder="FuelType"
                  fieldAs="select"
                  option={fuelTypeOptions}
                />
                <Fields
                  fieldLabel="Car Color"
                  fieldName="Color"
                  fieldPlaceholder="Color"
                />
              </div>
              <div className={InsertModalCSS["IM-form-sections"]}>
                <Fields
                  fieldLabel="Daily Rent Rate"
                  fieldName="RatePerDay"
                  fieldPlaceholder="Rate Per Day"
                  fieldType="number"
                  min="0"
                  onKeyPress={(e) => {
                    if (e.key === "-" || e.key === "+") {
                      e.preventDefault();
                    }
                  }}
                />
                <Fields
                  fieldLabel="Description"
                  fieldName="Description"
                  fieldPlaceholder="Description"
                  fieldType="text"
                  fieldAs="textarea"
                />

                <Fields
                  fieldLabel="SafetyRating"
                  fieldName="SafetyRating"
                  fieldPlaceholder="SafetyRating"
                  fieldType="text"
                  fieldAs="select"
                  option={safetyRatingOptions}
                />

                <ImageField
                  fieldLabel="Car Image"
                  imageName={values.CarImage ? values.CarImage.name : ""}
                  setFieldValue={setFieldValue}
                  onClickHandler={() => {
                    setFieldValue("CarImage", null);
                  }}
                  IMGvalues={values.CarImage}
                  fieldName="CarImage"
                  imgUrl={selectedCar?.imageUrl}
                  setImageUrlShown={setImageUrlShown}
                  imageUrlShown={imageUrlShown}
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
