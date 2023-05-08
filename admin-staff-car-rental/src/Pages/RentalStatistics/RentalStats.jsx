import React from "react";
import AdminNavbarmenu from "../../Layouts/AdminNavbar/AdminNavbarmenu";
import AdminHeader from "../../Components/AdminHeader/AdminHeader";
import RentalStatsCSS from "./RentalStats.module.css";
import { StatisticModule } from "../../Components/StatisticModule/StatisticModule";

export const RentalStats = () => {
  return (
    <>
      <AdminNavbarmenu />
      <div className={RentalStatsCSS["M-main-container"]}>
        <AdminHeader headingName="Rental Statistics" />
        <div className={RentalStatsCSS["M-secondary-container"]}>
          <StatisticModule />
        </div>
      </div>
    </>
  );
};
