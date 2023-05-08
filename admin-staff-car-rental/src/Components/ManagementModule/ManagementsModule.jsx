import React, { useState, useEffect, useContext } from "react";
import ManagementsCSS from "./Managements.module.css";
import { AuthContext } from "../../Hooks/AuthProvider";
import axios from "axios";
export const ManagementsModule = () => {
  const { user } = useContext(AuthContext);
  const role = user && user.role ? user.role : null;
  const host = process.env.REACT_APP_API_HOST;
  const [carCount, setCarCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${host}/api/Car/get_cars`, { withCredentials: true })
      .then((response) => {
        const data = response.data;
        setCarCount(data.cars.length);
      })
      .catch((error) => console.error("Error:", error));
    axios
      .get(`${host}/api/SpecialOffers/get_valid_offers`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setOfferCount(data.offer.length);
      })
      .catch((error) => console.error("Error:", error));
    axios
      .get(`${host}/api/Admin/get_staffs`, { withCredentials: true })
      .then((response) => {
        const data = response.data;
        setUserCount(data.users.length);
      })
      .catch((error) => console.error("Error:", error));
    axios
      .get(`${host}/api/RentalHistory/get_rental_history?status=Pending`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setRequestCount(data.history.length);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <>
      <div className={ManagementsCSS["M-card-container"]}>
        <div className={ManagementsCSS["M-card-group"]}>
          {role === "Admin" && (
            <div className={ManagementsCSS["M-card"]}>
              <div className={ManagementsCSS["M-card-content"]}>
                <h2 className={ManagementsCSS["M-header"]}>
                  <i
                    className={`${ManagementsCSS["M-icon"]} fa fa-user`}
                    aria-hidden="true"
                  ></i>{" "}
                  User Management
                </h2>
                <h6 className={ManagementsCSS["M-count"]}>
                  Total staff users: {userCount}
                </h6>
                <p>Create, Update, Delete and View Users of the system.</p>
                <a href="/UserManagement">Go to User Management</a>
              </div>
            </div>
          )}
          <div className={ManagementsCSS["M-card"]}>
            <div className={ManagementsCSS["M-card-content"]}>
              <h2 className={ManagementsCSS["M-header"]}>
                <i
                  className={`${ManagementsCSS["M-icon"]} fa fa-percent`}
                  aria-hidden="true"
                ></i>{" "}
                Offer Management
              </h2>
              <h6 className={ManagementsCSS["M-count"]}>
                Total valid offers: {offerCount}
              </h6>
              <p>Create, Update, Delete and View Offers along with its logs.</p>
              <a href="/OfferManagement">Go to Offer Management</a>
            </div>
          </div>
        </div>
        <div className={ManagementsCSS["M-card-group"]}>
          <div className={ManagementsCSS["M-card"]}>
            <div className={ManagementsCSS["M-card-content"]}>
              <h2 className={ManagementsCSS["M-header"]}>
                <i className={`${ManagementsCSS["M-icon"]} fas fa-car`}></i> Car
                Management
              </h2>
              <h6 className={ManagementsCSS["M-count"]}>
                Total Car Count: {carCount}
              </h6>
              <p>Create, Update, Delete and View Cars. </p>

              <a href="/CarManagement">Go to Car Management</a>
            </div>
          </div>
          <div className={ManagementsCSS["M-card"]}>
            <div className={ManagementsCSS["M-card-content"]}>
              <h2 className={ManagementsCSS["M-header"]}>
                <i
                  className={`${ManagementsCSS["M-icon"]} fa fa-handshake-o`}
                  aria-hidden="true"
                ></i>{" "}
                Rental Management
              </h2>
              <h6 className={ManagementsCSS["M-count"]}>
                Total Rental Requests: {requestCount}
              </h6>
              <p>Approve or Decline the rental requests sent by users.</p>
              <a href="/RentalManagement">Go to Rental Management</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
