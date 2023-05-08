import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationBoxCSS from "./NotificationBox.module.css";
import { ErrorModal } from "../ErrorModal/ErrorModal";
import { EmptyDataInfo } from "../EmptyData/EmptyDataInfo";
import Khalti from "../Khalti/Khalti";
import { SuccessModal } from "../SuccessModal/SuccessModal";
import PaymentLoadingOverlay from "./PaymentLoadingOverlay";

export const NotificationBox = () => {
  const [selected, setSelected] = useState("Notification");
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [success, setSuccess] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const fetchNotifData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${host}/api/Customer/get_notifs`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const notifications = response.data.rentalPayments
          .map((rentalNotif) => {
            return {
              id: rentalNotif.historyId,
              paymentId: rentalNotif.paymentId,
              startDate: rentalNotif.startDate,
              endDate: rentalNotif.endDate,
              amount: rentalNotif.amount,
              status: rentalNotif.status,
              carName: rentalNotif.car.name,
              carBrand: rentalNotif.car.brand,
              type: "rental",
            };
          })
          .concat(
            response.data.damagePayments.map((dmgNotif) => {
              return {
                id: dmgNotif.id,
                startDate: null,
                endDate: null,
                amount: dmgNotif.amount,
                status: dmgNotif.status,
                carName: dmgNotif.car.name,
                carBrand: dmgNotif.car.brand,
                type: "damage",
              };
            })
          )
          .concat(
            response.data.deniedRequests.map((deniedNotifs) => {
              return {
                id: deniedNotifs.historyId,
                startDate: deniedNotifs.startDate,
                endDate: deniedNotifs.endDate,
                amount: deniedNotifs.amount,
                status: deniedNotifs.status,
                carName: deniedNotifs.car.name,
                carBrand: deniedNotifs.car.brand,
                type: "denied",
              };
            })
          );
        setNotifs(notifications);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifData();
  }, [setNotifs, host]);

  const fetchOfferData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${host}/api/SpecialOffers/get_valid_offers`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOffers(response.data.offer);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOfferData();
  }, [setOffers, host]);

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
      />
      <div className={NotificationBoxCSS["NB-box"]}>
        <div className={NotificationBoxCSS["NB-topic"]}>
          <button
            onClick={() => setSelected("Notification")}
            className={
              selected === "Notification"
                ? `${NotificationBoxCSS["NB-title"]} ${NotificationBoxCSS["NB-title-active"]}`
                : `${NotificationBoxCSS["NB-title"]}`
            }
          >
            Notification
          </button>
          <button
            className={
              selected === "Special-Offer"
                ? `${NotificationBoxCSS["NB-title"]} ${NotificationBoxCSS["NB-title-active"]}`
                : `${NotificationBoxCSS["NB-title"]}`
            }
            onClick={() => setSelected("Special-Offer")}
          >
            Special Offers
          </button>
        </div>
        <div className={NotificationBoxCSS["NB-line"]} />
        {isLoading ? (
          <div className={NotificationBoxCSS["NB-referesh-container"]}>
            <i
              className={`${NotificationBoxCSS.refresh} fas fa-spinner fa-spin`}
            />
          </div>
        ) : selected === "Notification" ? (
          <ul className={NotificationBoxCSS["NB-box-contents"]}>
            {notifs && notifs.length > 0 ? (
              notifs
                .slice()
                .reverse()
                .map((notif) => (
                  <li
                    key={notif.paymentId}
                    className={NotificationBoxCSS["NB-individual"]}
                  >
                    <p
                      className={NotificationBoxCSS["NB-individual-title"]}
                      style={
                        notif.type === "rental"
                          ? { color: "green" }
                          : { color: "red" }
                      }
                    >
                      {notif.type === "rental"
                        ? "Request Approved"
                        : notif.type === "damage"
                        ? "Damage Report"
                        : "Request Denied"}
                    </p>
                    {notif.type === "rental" ? (
                      <>
                        <p
                          className={
                            NotificationBoxCSS["NB-individual-message"]
                          }
                        >{`You have rented ${notif.carName} [${notif.carBrand}] from ${notif.startDate} to ${notif.endDate}`}</p>
                        <p
                          className={NotificationBoxCSS["NB-individual-amount"]}
                        >
                          Your total charge was <span>Rs {notif.amount}</span>
                        </p>
                        <div className={NotificationBoxCSS["NB-khalti-button"]}>
                          <Khalti
                            type={notif.type}
                            amount={notif.amount}
                            productIdentity={notif.paymentId}
                            setSuccess={setSuccess}
                            setError={setError}
                            notifId={notif.id}
                            setNotifs={setNotifs}
                            notifs={notifs}
                            setIsPaymentLoading={setIsPaymentLoading}
                          />
                        </div>
                      </>
                    ) : notif.type === "damage" ? (
                      <>
                        <p
                          className={
                            NotificationBoxCSS["NB-individual-message"]
                          }
                        >{`Your damage report for ${notif.carName} car of brand ${notif.carBrand} has been analysed.`}</p>
                        <p
                          className={NotificationBoxCSS["NB-individual-amount"]}
                        >
                          You have been charged <span>Rs {notif.amount}</span>{" "}
                          for the damages
                        </p>
                        <div className={NotificationBoxCSS["NB-khalti-button"]}>
                          <Khalti
                            type={notif.type}
                            amount={notif.amount}
                            productIdentity={notif.id}
                            setSuccess={setSuccess}
                            setError={setError}
                            notifId={notif.id}
                            setNotifs={setNotifs}
                            notifs={notifs}
                            setIsPaymentLoading={setIsPaymentLoading}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          className={
                            NotificationBoxCSS["NB-individual-message"]
                          }
                        >{`Your request for ${notif.carName} car of brand ${notif.carBrand} from ${notif.startDate} to ${notif.endDate} has been denied.`}</p>
                      </>
                    )}
                  </li>
                ))
            ) : (
              <EmptyDataInfo
                message="No Notifcations found"
                reload={false}
                type={fetchNotifData}
              />
            )}
          </ul>
        ) : (
          <ul className={NotificationBoxCSS["NB-box-contents"]}>
            {offers && offers.length > 0 ? (
              offers
                .slice()
                .reverse()
                .map((offer) => (
                  <li
                    key={offer.id}
                    className={NotificationBoxCSS["NB-individual"]}
                  >
                    <div className={NotificationBoxCSS["NB-title-discount"]}>
                      <p className={NotificationBoxCSS["NB-individual-title"]}>
                        {offer.offerTitle}
                      </p>
                      <p
                        className={NotificationBoxCSS["NB-individual-discount"]}
                      >
                        Discount: {offer.discount}%
                      </p>
                    </div>
                    <p
                      style={{ fontWeight: "600" }}
                      className={NotificationBoxCSS["NB-individual-message"]}
                    >
                      Car Name: {offer.carName}
                    </p>

                    <p className={NotificationBoxCSS["NB-individual-message"]}>
                      {offer.offerDescription}
                    </p>
                    <p className={NotificationBoxCSS["NB-individual-date"]}>
                      {offer.startDate} to {offer.endDate}
                    </p>
                  </li>
                ))
            ) : (
              <EmptyDataInfo
                message="No Offers available"
                reload={false}
                type={fetchOfferData}
              />
            )}
          </ul>
        )}
      </div>
      {isPaymentLoading && <PaymentLoadingOverlay />}
    </>
  );
};
