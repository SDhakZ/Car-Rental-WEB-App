import myKey from "./KhaltiKey";
import KhaltiCheckout from "khalti-checkout-web";
import axios from "axios";
import "./khalti.css";
import React from "react";

export default function Khalti({ type, ...props }) {
  const host = process.env.REACT_APP_API_HOST;

  let config = {
    // replace the publicKey with yours
    publicKey: myKey.publicTestKey,
    productIdentity: props.productIdentity,
    productName: "Car rental",
    productUrl: "https://localhost:3000/",
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
    eventHandler: {
      async onSuccess(payload) {
        // hit merchant api for initiating verfication
        console.log(payload);

        // Use the 'type' prop to decide which API endpoint to hit
        const apiEndpoint =
          type === "rental"
            ? `${host}/api/RentalPayment/verify_payment`
            : `${host}/api/DamagePayment/verify_payment`;

        try {
          props.setIsPaymentLoading(true);
          const response = await axios.post(apiEndpoint, null, {
            params: {
              token: payload.token,
              amount: props.amount,
            },
            withCredentials: true,
          });
          if (response.status === 200) {
            const updatedNotifs = props.notifs.filter(
              (notif) => notif.id !== props.notifId
            );
            props.setNotifs(updatedNotifs);
            props.setSuccess("Payment successful");
          }
          console.log("Success:", response.data);
        } catch (error) {
          console.error("Error:", error);
          if (error.response) {
            props.setError(error.response.data.amount); // Set the error state to the error message from the response
          } else {
            props.setError("An error occurred");
          }
        } finally {
          props.setIsPaymentLoading(false);
        }
      },
      onError(error) {
        console.log(error);
      },
      onClose() {
        console.log("widget is closing");
      },
    },
  };

  let checkout = new KhaltiCheckout(config);

  return (
    <div>
      <button
        className="khalti-button"
        onClick={() => checkout.show({ amount: props.amount })}
      >
        <img
          className="khalti"
          src={require("../../Assets/khalti_white.png")}
        ></img>{" "}
        Pay via khalti
      </button>
    </div>
  );
}
