import React from "react";
import "./PaymentOverlay.css";

const PaymentLoadingOverlay = () => {
  return (
    <div className="payment-loading-overlay">
      <div className="payment-loading-message">
        <h4>Processing payment...</h4>
        <i className="fas fa-spinner fa-spin" />
      </div>
    </div>
  );
};

export default PaymentLoadingOverlay;
