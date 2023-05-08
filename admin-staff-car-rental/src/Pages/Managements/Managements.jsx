import React from "react";
import AdminNavbarmenu from "../../Layouts/AdminNavbar/AdminNavbarmenu";
import ManagementsCSS from "./Managements.module.css";
import AdminHeader from "../../Components/AdminHeader/AdminHeader";
import { ManagementsModule } from "../../Components/ManagementModule/ManagementsModule";

export const Managements = () => {
  return (
    <>
      <AdminNavbarmenu />
      <div className={ManagementsCSS["M-main-container"]}>
        <AdminHeader headingName="Managements" />
        <div className={ManagementsCSS["M-secondary-container"]}>
          <ManagementsModule />
        </div>
      </div>
    </>
  );
};
