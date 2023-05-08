import React, { useState, useEffect, useCallback } from "react";
import StatisticModuleCSS from "./StatisticModule.module.css";
import axios from "axios";

export const StatisticModule = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [salesCount, setSalesCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  useEffect(() => {
    axios
      .get(`${host}/api/CarRental/regular_customers`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setActiveCount(data.regularCustomers.length);
      })
      .catch((error) => console.error("Error:", error));
    axios
      .get(`${host}/api/CarRental/inactive_customers`, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setInactiveCount(data.inactiveCustomers.length);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const fetchSalesCount = useCallback(() => {
    axios
      .post(
        `${host}/api/Sales/rentals_paid`,
        {
          CustomerId: "",
          startDate: "",
          endDate: "",
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const data = response.data;
        let total_revenue = 0;
        for (let rental of data.rentalData) {
          total_revenue += rental.totalCharge;
        }
        setSalesCount(total_revenue);
      })
      .catch((error) => console.error("Error:", error));
  }, [host]);

  useEffect(() => {
    fetchSalesCount();
  }, [fetchSalesCount]);
  return (
    <div className={StatisticModuleCSS["SM-card-container"]}>
      <div className={StatisticModuleCSS["SM-card-group"]}>
        <div className={StatisticModuleCSS["SM-card"]}>
          <div className={StatisticModuleCSS["SM-card-content"]}>
            <h2 className={StatisticModuleCSS["SM-header"]}>
              <i
                className={`${StatisticModuleCSS["SM-icon"]} fa fa-user`}
                aria-hidden="true"
              ></i>{" "}
              <i className="fa fa-table" aria-hidden="true"></i> User Statistics
            </h2>
            <h6 className={StatisticModuleCSS["SM-count"]}>
              Total Active Customers: {activeCount}
            </h6>
            <h6 className={StatisticModuleCSS["SM-count"]}>
              Total Inactive Customers: {inactiveCount}
            </h6>
            <p>
              Check the user statistics with details of frequent users and
              inactive users.
            </p>
            <a href="/UserStats">View User Statistics</a>
          </div>
        </div>
        <div className={StatisticModuleCSS["SM-card"]}>
          <div className={StatisticModuleCSS["SM-card-content"]}>
            <h2 className={StatisticModuleCSS["SM-header"]}>
              <i
                className={`${StatisticModuleCSS["SM-icon"]} fa fa-car`}
                aria-hidden="true"
              ></i>{" "}
              <i className="fa fa-bar-chart" aria-hidden="true"></i> Car Rent
              Statistics
            </h2>
            <p>
              Check the car rental statistics where you can find the cars that
              have been frequently rented and the cars that have not been
              rented.
            </p>
            <a href="/CarStats">View Car Rent Statistics</a>
          </div>
        </div>
      </div>
      <div className={StatisticModuleCSS["SM-card-group"]}>
        <div className={StatisticModuleCSS["SM-card"]}>
          <div className={StatisticModuleCSS["SM-card-content"]}>
            <h2 className={StatisticModuleCSS["SM-header"]}>
              <i
                className={`${StatisticModuleCSS["SM-icon"]} fa fa-history`}
                aria-hidden="true"
              ></i>{" "}
              Rental History
            </h2>
            <p>
              Check the logs/history of all the request of cars with theier
              status.
            </p>
            <a href="/RentalHistory">View Rental History</a>
          </div>
        </div>
        <div className={StatisticModuleCSS["SM-card"]}>
          <div className={StatisticModuleCSS["SM-card-content"]}>
            <h2 className={StatisticModuleCSS["SM-header"]}>
              <i
                className={`${StatisticModuleCSS["SM-icon"]} fa fa-money`}
                aria-hidden="true"
              ></i>{" "}
              Car Sales
            </h2>
            <h6 className={StatisticModuleCSS["SM-count"]}>
              Total Sales upto date: Rs. {salesCount}
            </h6>
            <p>
              See the total sales of the cars that has been successfully rented.
            </p>
            <a href="/CarSales">View Car Rent Statistics</a>
          </div>
        </div>
      </div>
      <div className={StatisticModuleCSS["SM-card-group"]}></div>
    </div>
  );
};
