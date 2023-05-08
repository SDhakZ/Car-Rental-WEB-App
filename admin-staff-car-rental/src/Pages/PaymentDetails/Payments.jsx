import React from "react";
import AdminNavbarmenu from "../../Layouts/AdminNavbar/AdminNavbarmenu";
import PaymentsCSS from "./Payment.module.css";
import AdminHeader from "../../Components/AdminHeader/AdminHeader";
import { PaymentModule } from "../../Components/PaymentModule/PaymentModule";

export const Payments = () => {
  return (
    <>
      <AdminNavbarmenu />
      <div className={PaymentsCSS["P-main-container"]}>
        <AdminHeader headingName="Payments" />
        <div className={PaymentsCSS["P-secondary-container"]}>
          <PaymentModule />
        </div>
      </div>
    </>
  );
};
