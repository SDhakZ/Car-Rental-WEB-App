import React, { useState, useEffect } from "react";
import CarDetailCSS from "./IndividualCarDetail.module.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { RentRequestModal } from "../IndividualCarDetail/RentRequestModal/RentRequestModal";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";

export const CarDetail = () => {
  const [car, setCar] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const host = process.env.REACT_APP_API_HOST;
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${host}/api/Car/car_details?id=${id}`
        );
        if (response.status === 200) {
          setCar(response.data.car);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError(error.message);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [setCar, id, host]);

  return (
    <>
      <ErrorModal
        message={error}
        show={error !== ""}
        onClose={() => {
          setError("");
        }}
      />
      <SuccessModal
        message={success}
        show={success !== ""}
        onClose={() => setSuccess("")}
        refresh={true}
      />
      <div className={CarDetailCSS["CD-main-container"]}>
        <div>
          <Link className={CarDetailCSS["CD-backButton"]} to="/ViewCar">
            &lt;&lt; &nbsp;Go Back
          </Link>
        </div>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className={CarDetailCSS["CD-secondary-container"]}>
            <div className={CarDetailCSS["CD-img-container"]}>
              <img
                className={CarDetailCSS["CD-image"]}
                src={car?.imageUrl}
                alt="img not available"
              ></img>
            </div>
            <div className={CarDetailCSS["CD-name-section"]}>
              <div className={CarDetailCSS["CD-name-availability"]}>
                <h1 className={CarDetailCSS["CD-name"]}>{car?.carName}</h1>
                <p
                  style={{
                    color:
                      car?.status === "Available"
                        ? "#1ab917"
                        : car?.status === "Damaged"
                        ? "red"
                        : car?.status === "Rented"
                        ? "Blue"
                        : "orange",
                    fontWeight: "600",
                    borderColor:
                      car?.status === "Available"
                        ? "#1ab917"
                        : car?.status === "Damaged"
                        ? "red"
                        : car?.status === "Rented"
                        ? "Blue"
                        : "orange",
                  }}
                  className={CarDetailCSS["CD-availability"]}
                >
                  {car?.status}
                </p>
              </div>

              {car?.status === "Available" ? (
                <button
                  className={CarDetailCSS["CD-rentButton"]}
                  onClick={() => setOpenModal(true)}
                >
                  Rent Now
                </button>
              ) : (
                <button
                  title="Sorry the car is currently unavailable for rent"
                  style={{ backgroundColor: "grey" }}
                  disabled={true}
                  className={CarDetailCSS["CD-rentButton"]}
                  onClick={() => setOpenModal(true)}
                >
                  Rent Now
                </button>
              )}
            </div>
            <div className={CarDetailCSS["CD-brand"]}>{car?.brand}</div>
            <div className={CarDetailCSS["CD-information"]}>
              <div className={CarDetailCSS["CD-information-left"]}>
                <div className={CarDetailCSS["CD-individual-information"]}>
                  <i
                    className={`${CarDetailCSS.tachometer} fa-solid fa fa-tachometer`}
                  />
                  <p>
                    Mileage: {car?.mileage}
                    {car?.fuelType === "Electric" ? "km/kWh" : "km/l"}
                  </p>
                </div>
                <div className={CarDetailCSS["CD-individual-information"]}>
                  <i
                    className={`${CarDetailCSS.brush} fa-solid fa-paint-brush`}
                  />
                  <p>Color: {car?.color}</p>
                </div>
                <div className={CarDetailCSS["CD-individual-information"]}>
                  <i className={`${CarDetailCSS.pump} fa-solid fa-gas-pump`} />
                  <p>Fuel Type: {car?.fuelType}</p>
                </div>
              </div>
              <div className={CarDetailCSS["CD-information-right"]}>
                <div className={CarDetailCSS["CD-individual-information"]}>
                  <i className={`${CarDetailCSS.tag} fa-solid fa-tag`} />
                  <p>Daily Rent Rate: Rs {car?.ratePerDay}/Day</p>
                </div>

                <div className={CarDetailCSS["CD-individual-information"]}>
                  <i
                    className={`${CarDetailCSS.envelope} fa-solid fa-shield`}
                  />
                  <p>Safety Rating: {car?.safetyRating} </p>
                </div>
              </div>
            </div>
            <div className={CarDetailCSS["CD-description"]}>
              <p className={CarDetailCSS["CD-title"]}>Car Description</p>
              <p className={CarDetailCSS["CD-paragraph"]}>{car?.description}</p>
            </div>
          </div>
        )}
        <RentRequestModal
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
          }}
          setSuccess={setSuccess}
          setError={setError}
          rentPerDay={car?.ratePerDay}
          carId={id}
          setOpenModal={setOpenModal}
        />
      </div>
    </>
  );
};
