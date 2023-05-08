import React, { useState, useEffect } from "react";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import CarDetailCSS from "./IndividualCarDetail.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { useNavigate, useLocation } from "react-router-dom";

export const IndividualCarDetail = () => {
  const [car, setCar] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const host = process.env.REACT_APP_API_HOST;
  const [error, setError] = useState("");
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState("/CarManagement");

  /* Api get car details */
  useEffect(() => {
    if (location.state && location.state.from) {
      setPreviousPage(location.state.from);
    } else {
      setPreviousPage("/CarManagement");
    }
  }, [location]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(previousPage);
  };
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
      <AdminNavbarmenu />
      <ErrorModal
        message={error}
        show={error !== ""}
        onClose={() => {
          setError("");
        }}
      />
      <div className={CarDetailCSS["CD-main-container"]}>
        <div>
          <button className={CarDetailCSS["CD-backButton"]} onClick={goBack}>
            &lt;&lt; &nbsp;Go Back
          </button>
        </div>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className={CarDetailCSS["CD-secondary-container"]}>
            <div className={CarDetailCSS["CD-img-container"]}>
              <img
                alt="Car"
                className={CarDetailCSS["CD-image"]}
                src={car?.imageUrl}
              ></img>
            </div>
            <div className={CarDetailCSS["CD-name-availability"]}>
              <h1 className={CarDetailCSS["CD-name"]}>{car?.carName}</h1>
              <p
                style={{
                  color:
                    car?.status === "Available"
                      ? "#1ab917"
                      : car?.status === "Damaged"
                      ? "yellow"
                      : "red",
                  fontWeight: "600",
                  borderColor:
                    car?.status === "Available"
                      ? "#1ab917"
                      : car?.status === "Damaged"
                      ? "yellow"
                      : "red",
                }}
                className={CarDetailCSS["CD-availability"]}
              >
                {car?.status}
              </p>
            </div>
            <div className={CarDetailCSS["CD-brand"]}>{car?.brand}</div>
            <div className={CarDetailCSS["CD-information"]}>
              <div className={CarDetailCSS["CD-information-left"]}>
                <div className={CarDetailCSS["CD-individual-information"]}>
                  <i
                    className={`${CarDetailCSS.tachometer} fa-solid fa fa-tachometer`}
                  />
                  <p>
                    Mileage: {car?.mileage}{" "}
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
      </div>
    </>
  );
};
