import React from "react";
import AdminNavbarmenu from "../../Layouts/AdminNavbar/AdminNavbarmenu";
import AdminHeader from "../AdminHeader/AdminHeader";
import WrongRouteCSS from "./WrongRoute.module.css";
export const WrongRoutePage = () => {
  return (
    <>
      <AdminNavbarmenu />
      <div className={WrongRouteCSS["WR-main-container"]}>
        <AdminHeader headingName="Page not found" />
        <div className={WrongRouteCSS["WR-img-container"]}>
          <img
            className={WrongRouteCSS["WR-img"]}
            src={require("../../Assets/carCrash.png")}
            alt="car crash"
          />
          <a className={WrongRouteCSS["WR-home"]} href="/">
            Go to home
          </a>
        </div>
      </div>
    </>
  );
};
