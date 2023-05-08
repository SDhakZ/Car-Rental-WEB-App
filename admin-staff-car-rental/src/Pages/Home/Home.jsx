import React, { useState, useEffect } from "react";
import AdminNavbarmenu from "../../Layouts/AdminNavbar/AdminNavbarmenu";
import { StatisticModule } from "../../Components/StatisticModule/StatisticModule";
import HomeCSS from "./Home.module.css";
import AdminHeader from "../../Components/AdminHeader/AdminHeader";
import { ManagementsModule } from "../../Components/ManagementModule/ManagementsModule";
import { PaymentModule } from "../../Components/PaymentModule/PaymentModule";
import BarChart from "../../Components/BarChart/BarChart";
import axios from "axios";
import { ErrorModal } from "../../Components/ErrorModal/ErrorModal";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";
export const Home = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [notRentedCarSelected, setNotRentedCarSelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${host}/api/CarRental/frequently_rented_cars`;
        if (notRentedCarSelected) {
          url = `${host}/api/CarRental/not_rented_cars`;
        }
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          notRentedCarSelected
            ? setCars(response.data.notRentedCars)
            : setCars(response.data.rentedCars);
          setShowErrorPage(false);
          setShowError(false);
        }
      } catch (error) {
        setShowErrorPage(true);
        setShowError(true);
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError(error.message);
          }
        } else {
          setError(error.message);
        }
      }
    };
    fetchData();
  }, [setCars, host, notRentedCarSelected]);

  const getTopRentedCars = (cars) => {
    return cars.slice(0, 5).map((car) => ({
      ...(car?.car || car),
      rentalCount: car.rentalCount || 0,
    }));
  };
  return (
    <>
      <div>
        <AdminNavbarmenu />

        <div className={HomeCSS["H-main-container"]}>
          <ErrorModal
            message={error}
            show={showError}
            onClose={() => {
              setShowError(false);
            }}
          />
          {showErrorPage ? (
            <ErrorPage />
          ) : (
            getTopRentedCars(cars).length > 0 && (
              <div className={HomeCSS["H-secondary-container"]}>
                <AdminHeader headingName="Frequently Rented Cars" />
                <BarChart
                  data={getTopRentedCars(cars).map((car) => car.rentalCount)}
                  labels={getTopRentedCars(cars).map((car) => `${car.name}`)}
                />
              </div>
            )
          )}
          <div className={HomeCSS["H-secondary-container"]}>
            <AdminHeader headingName="Managements" />
            <ManagementsModule />
          </div>
          <div className={HomeCSS["H-secondary-container"]}>
            <AdminHeader headingName="Payments" />
            <PaymentModule />
          </div>
          <div className={HomeCSS["H-secondary-container"]}>
            <AdminHeader headingName="Rental Statistics" />
            <StatisticModule />
          </div>
        </div>
      </div>
    </>
  );
};
