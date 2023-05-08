import React from "react";
import ViewCarCSS from "./ViewCar.module.css";
import { useNavigate } from "react-router-dom";

export const ViewCarCard = (props) => {
  const navigate = useNavigate();

  const handleView = () => {
    props.landingPath
      ? navigate(`viewCar/${props.carId}`)
      : navigate(`${props.carId}`);
  };

  return (
    <>
      <button
        className={ViewCarCSS["VC-card"]}
        onClick={() => {
          window.scrollTo({ top: 0 });
          handleView();
        }}
      >
        <div className={ViewCarCSS["VC-image-container"]}>
          <img
            className={ViewCarCSS["VC-image"]}
            src={props.imageUrl}
            alt="img not available"
          />
        </div>
        <div className={ViewCarCSS["VC-details"]}>
          <div>
            <div className={ViewCarCSS["VC-name-availability"]}>
              <p className={ViewCarCSS["VC-name"]}>{props.carName}</p>
              <p
                style={{
                  color:
                    props.status === "Available"
                      ? "#1ab917"
                      : props.status === "Damaged"
                      ? "red"
                      : props.status === "Rented"
                      ? "blue"
                      : "orange",
                  fontWeight: "600",
                  borderColor:
                    props.status === "Available"
                      ? "#1ab917"
                      : props.status === "Damaged"
                      ? "red"
                      : props.status === "Rented"
                      ? "blue"
                      : "orange",
                }}
                className={ViewCarCSS["VC-availability"]}
              >
                {props.status}
              </p>
            </div>
            <div className={ViewCarCSS["VC-brand"]}>{props.brand}</div>
          </div>
          <div className={ViewCarCSS["VC-information"]}>
            <div className={ViewCarCSS["VC-information-left"]}>
              <div className={ViewCarCSS["VC-individual-information"]}>
                <i
                  className={`${ViewCarCSS.tachometer} fa-solid fa fa-tachometer`}
                />
                <p>
                  {props.mileage}{" "}
                  {props.fuelType === "Electric" ? "km/kWh" : "km/l"}
                </p>
              </div>

              <div className={ViewCarCSS["VC-individual-information"]}>
                <i className={`${ViewCarCSS.pump} fa-solid fa-gas-pump`} />
                <p>{props.fuelType}</p>
              </div>
            </div>
            <div className={ViewCarCSS["VC-information-right"]}>
              <div className={ViewCarCSS["VC-individual-information"]}>
                <i className={`${ViewCarCSS.brush} fa-solid fa-paint-brush`} />
                <p>{props.color}</p>
              </div>
              <div className={ViewCarCSS["VC-individual-information"]}>
                <i className={`${ViewCarCSS.envelope} fa-solid fa-shield`} />
                <p>Safety Rating: &nbsp; {props.safetyRating} </p>
              </div>
            </div>
          </div>
          <div className={ViewCarCSS["VC-line-tag-view"]}>
            <div className={ViewCarCSS["VC-line"]} />
            <div className={ViewCarCSS["VC-tag-view"]}>
              <p className={ViewCarCSS["VC-tag"]}>
                Rs.{props.ratePerDay}
                <span className={ViewCarCSS["VC-day"]}>/Day</span>
              </p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0 });
                  handleView();
                }}
                className={ViewCarCSS["VC-button"]}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </button>
    </>
  );
};
