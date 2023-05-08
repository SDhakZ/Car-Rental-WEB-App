import React, { useState, useEffect, useContext } from "react";
import PaymentModuleCSS from "./PaymentModule.module.css";
import axios from "axios";

export const PaymentModule = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [damageRequests, setDamageRequests] = useState(0);
  const [damageApprovalCount, setDamageApprovalCount] = useState(0);
  const [paymentApprovalCount, setPaymentApprovalCount] = useState(0);
  const [returnCount, setReturnCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${host}/api/RentalPayment/rental_payments?paymentStatus=Pending`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setPaymentApprovalCount(data.payments.length);
      })
      .catch((error) => console.error("Error:", error));
    axios
      .get(
        `${host}/api/DamagePayment/get_damage_payments?paymentStatus=Pending`,
        { withCredentials: true }
      )
      .then((response) => {
        const data = response.data;
        setDamageApprovalCount(data.payments.length);
      })
      .catch((error) => console.error("Error:", error));
    axios
      .get(`${host}/api/DamageRequest/get_all_req?requestStatus=Pending`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setDamageRequests(data.damageRequests.length);
      })
      .catch((error) => console.error("Error:", error));
    axios
      .get(`${host}/api/RentalHistory/get_rental_history?status=Paid`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setReturnCount(data.history.length);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className={PaymentModuleCSS["PM-card-container"]}>
      <div className={PaymentModuleCSS["PM-card-group"]}>
        <div className={PaymentModuleCSS["PM-card"]}>
          <div className={PaymentModuleCSS["PM-card-content"]}>
            <h2 className={PaymentModuleCSS["PM-header"]}>
              <i
                className={`${PaymentModuleCSS["PM-icon"]} fa fa-money`}
                aria-hidden="true"
              ></i>{" "}
              <i className="fa fa-check" aria-hidden="true"></i> Payment
              Approval
            </h2>
            <h6 className={PaymentModuleCSS["PM-count"]}>
              Total Payment Approvals: {paymentApprovalCount}
            </h6>
            <h6 className={PaymentModuleCSS["PM-count"]}>
              Total Damage Payment Approvals: {damageApprovalCount}
            </h6>
            <p>Approval of car payments and the damage payments of the cars.</p>
            <a href="/PaymentApproval">View Payment Approvals</a>
          </div>
        </div>
        <div className={PaymentModuleCSS["PM-card"]}>
          <div className={PaymentModuleCSS["PM-card-content"]}>
            <h2 className={PaymentModuleCSS["PM-header"]}>
              <i
                className={`${PaymentModuleCSS["PM-icon"]} fas fa-car-crash`}
                aria-hidden="true"
              ></i>{" "}
              <i className="fa-solid fa-message" aria-hidden="true"></i> Damage
              Requests
            </h2>
            <h6 className={PaymentModuleCSS["PM-count"]}>
              Total Damage Requests: {damageRequests}
            </h6>

            <p>
              Send damage amounts to users who have informed about the damage
              done to the rented car.
            </p>
            <a href="/DamageRequest">View Damage Requests</a>
          </div>
        </div>
      </div>
      <div className={PaymentModuleCSS["PM-card-group"]}>
        <div className={PaymentModuleCSS["PM-card"]}>
          <div className={PaymentModuleCSS["PM-card-content"]}>
            <h2 className={PaymentModuleCSS["PM-header"]}>
              <i
                className={`${PaymentModuleCSS["PM-icon"]} fas fa-car-crash`}
                aria-hidden="true"
              ></i>
              <i
                className={`${PaymentModuleCSS["PM-icon"]} fa fa-history`}
                aria-hidden="true"
              ></i>{" "}
              Damage Payment Logs
            </h2>
            <p>
              Check the logs/history of the damage payments with adequate
              information.
            </p>
            <a href="/DamagePaymentLogs">View Damage Payment Logs</a>
          </div>
        </div>
        <div className={PaymentModuleCSS["PM-card"]}>
          <div className={PaymentModuleCSS["PM-card-content"]}>
            <h2 className={PaymentModuleCSS["PM-header"]}>
              <i className={`fas fa-car`} aria-hidden="true"></i> Return Car
            </h2>
            <h6 className={PaymentModuleCSS["PM-count"]}>
              Total Cars to return: {returnCount}
            </h6>
            <p>
              Return the cars when the user has returned the car and the payment
              is completed.
            </p>
            <a href="/ReturnCar">View Return Car</a>
          </div>
        </div>
      </div>
      <div className={PaymentModuleCSS["PM-card-group"]}></div>
    </div>
  );
};
