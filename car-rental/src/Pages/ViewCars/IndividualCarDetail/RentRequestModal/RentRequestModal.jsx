import React, { useState, useRef, useContext, useEffect } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { DatePickerField } from "../../../../Components/Fields/Fields";
import RentRequestModalCSS from "./RentRequestModal.module.css";
import axios from "axios";
import { AuthContext } from "../../../../Hooks/AuthContext";
import { LoadingPage } from "../../../../Components/LoadingPage/LoadingPage";
import { ErrorModal } from "../../../../Components/ErrorModal/ErrorModal";

const calculateTotalPrice = (startDate, endDate, rentPerDay) => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return dayDifference * rentPerDay;
  }
  return 0;
};

export const RentRequestModal = (props) => {
  const host = process.env.REACT_APP_API_HOST;
  const { show, rentPerDay, handleClose, setSuccess, carId, setOpenModal } =
    props;
  const [discount, setDiscount] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [citizenshipLicense, setCitizenshipLicense] = useState("citizenship");
  const { user } = useContext(AuthContext);
  const customerId = user && user.id ? user.id : null;
  const [hasDocument, setHasDocument] = useState(
    user && user.hasDocument ? "true" : "false"
  );

  const validationSchema = Yup.object().shape({
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "Date exceeds start date")
      .test("not-same", "End date must be after start date", function (value) {
        const startDate = this.resolve(Yup.ref("startDate"));
        return startDate && value && startDate < value;
      }),
    ...(hasDocument === "false"
      ? {
          Image: Yup.mixed().required(
            "Document is required for renting the car"
          ),
        }
      : {}),
  });
  const handleCitizenshipLicenseChange = (event) => {
    setCitizenshipLicense(event.target.value);
  };

  const handleRequestFormik = () => {
    formRef.current.submitForm();
  };

  const handleUploadFile = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("UserId", customerId);
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
        setHasDocument("true");
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRentRequest = async (values) => {
    try {
      let uploadResponse;
      if (hasDocument === "false") {
        uploadResponse = await handleUploadFile(values);
      }

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
        customerId: customerId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        carId: carId,
      };

      if (uploadResponse) {
        fieldData.DocumentUrl = uploadResponse.data.url;
        fieldData.DocumentId = uploadResponse.data.id;
      }

      const response = await axios({
        method: "post",
        url: `${host}/api/Customer/make_request`,
        data: fieldData,
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess("Rent request successfully sent");
        setOpenModal(false);
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios({
          method: "post",
          url: `${host}/api/Customer/get_discount?carId=${carId}`,
          withCredentials: true,
        });

        if (response.status === 200) {
          setDiscount(response.data.discount);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            console.log(error.response.data.message);
          } else {
            console.log(error.message);
          }
        } else {
          console.log(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setDiscount, host, carId, customerId]);

  const getDiscountedPrice = (totalPrice) => {
    const discountedPrice = totalPrice - (discount / 100) * totalPrice;
    return Math.round(discountedPrice);
  };

  return (
    <>
      <ErrorModal
        message={error}
        show={error !== ""}
        onClose={() => {
          setError("");
        }}
      />
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Modal size={customerId ? "lg" : ""} show={show} onHide={handleClose}>
          <Modal.Header style={{ padding: "0px" }}>
            <p className={RentRequestModalCSS["RRM-title"]}>
              {customerId ? "Let's Get This Car!" : "Please Sign In"}
            </p>
          </Modal.Header>
          {customerId ? (
            <Modal.Body>
              <Formik
                innerRef={formRef}
                initialValues={{
                  startDate: "",
                  endDate: "",
                  ...(hasDocument === "false" ? { Image: null } : {}),
                }}
                validationSchema={validationSchema}
                onSubmit={handleRentRequest}
              >
                {({ values, setFieldValue }) => {
                  const totalPrice = calculateTotalPrice(
                    values.startDate,
                    values.endDate,
                    rentPerDay
                  );
                  return (
                    <Form className={RentRequestModalCSS["RRM-form"]}>
                      <div className={RentRequestModalCSS["RRM-form-message"]}>
                        From when and till when do u want to rent the car for?
                      </div>
                      <div className={RentRequestModalCSS["RRM-form-dates"]}>
                        <div className={RentRequestModalCSS["RRM-form-date"]}>
                          <DatePickerField
                            fieldLabel="From"
                            fieldName="startDate"
                            fieldPlaceholder="Start Date"
                            setFieldValue={setFieldValue}
                            values={values}
                          />
                        </div>
                        <div className={RentRequestModalCSS["RRM-form-date"]}>
                          <DatePickerField
                            fieldLabel="To"
                            fieldName="endDate"
                            fieldPlaceholder="End Date"
                            setFieldValue={setFieldValue}
                            values={values}
                          />
                        </div>
                      </div>
                      <div
                        className={RentRequestModalCSS["RRM-discount-price"]}
                      >
                        <p className={RentRequestModalCSS["RRM-discount"]}>
                          Discount: <span>{discount ? discount : "0"}%</span>
                        </p>
                        <p className={RentRequestModalCSS["RRM-price"]}>
                          Total Price: <span>Rs {totalPrice}</span>
                        </p>
                        {discount ? (
                          <p className={RentRequestModalCSS["RRM-dis-price"]}>
                            Discounted Price:{" "}
                            <span>Rs {getDiscountedPrice(totalPrice)}</span>
                          </p>
                        ) : null}
                      </div>
                      {hasDocument === "false" ? (
                        <div>
                          <div
                            className={
                              RentRequestModalCSS["RRM-addGroup-radio"]
                            }
                          >
                            <label
                              htmlFor="pass"
                              className={RentRequestModalCSS["RRM-label"]}
                            >
                              Add a citizenship / license
                            </label>
                            <ErrorMessage
                              name="Image"
                              component="p"
                              style={{ color: "red" }}
                              className={RentRequestModalCSS["UPM-validation"]}
                            />
                            <label
                              htmlFor="Image"
                              className={RentRequestModalCSS["RRM-uploadImage"]}
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
                                className={
                                  RentRequestModalCSS["RRM-selectFile"]
                                }
                              />
                            </label>
                          </div>

                          <div
                            className={RentRequestModalCSS["RRM-radio-file"]}
                          >
                            <div
                              className={RentRequestModalCSS["RRM-radio-group"]}
                            >
                              <label
                                className={RentRequestModalCSS["RRM-radio"]}
                              >
                                <input
                                  type="radio"
                                  name="citizenship-license"
                                  value="citizenship"
                                  onChange={handleCitizenshipLicenseChange}
                                  checked={citizenshipLicense === "citizenship"}
                                />
                                &nbsp; Citizenship
                              </label>
                              <label
                                className={RentRequestModalCSS["RRM-radio"]}
                              >
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

                            {values.Image && (
                              <div
                                className={
                                  RentRequestModalCSS["RRM-file-group"]
                                }
                              >
                                <button
                                  title="Remove picture"
                                  onClick={() => {
                                    setFieldValue("Image", null);
                                  }}
                                  className={
                                    RentRequestModalCSS["RRM-remove-file"]
                                  }
                                >
                                  <i
                                    className={`${RentRequestModalCSS.fileCross} fa fa-close`}
                                  ></i>
                                </button>
                                <label
                                  className={
                                    RentRequestModalCSS["RRM-file-name"]
                                  }
                                >
                                  {values.Image ? values.Image.name : ""}
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </Form>
                  );
                }}
              </Formik>
            </Modal.Body>
          ) : (
            <div className={RentRequestModalCSS["RRM-alt-modal"]}>
              <p>
                You must sign in before renting the car. Sign in now by pressing
                the sign in button.
              </p>
            </div>
          )}
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            {customerId ? (
              <Button variant="primary" onClick={handleRequestFormik}>
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Send Request"
                )}
              </Button>
            ) : (
              <a
                href="/signin"
                className={RentRequestModalCSS["RRM-signin-button"]}
              >
                Sign In
              </a>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
