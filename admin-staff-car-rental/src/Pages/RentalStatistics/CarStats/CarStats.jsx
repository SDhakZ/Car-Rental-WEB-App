import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import AdminNavarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import CarStatsCSS from "./CarStats.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import BarChart from "../../../Components/BarChart/BarChart";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const CarStats = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [notRentedCarSelected, setNotRentedCarSelected] = useState(false);
  const [limitedOptions, setLimitedOptions] = useState([]);
  const navigate = useNavigate();

  const handleView = (id) => {
    let path = `/IndividualCarDetail/${id}`;
    navigate(path, { state: { from: "/CarStats" } });
  };

  /*-Filter, Sort and Search- */
  const customFilter = (option, inputValue) => {
    if (inputValue) {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    } else {
      const isInTop5 = limitedOptions.some(
        (limitedOption) => limitedOption.value === option.value
      );
      return isInTop5;
    }
  };

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  const sortedUsers = [...cars].sort((a, b) => {
    let columnA, columnB;

    if (notRentedCarSelected) {
      columnA = a?.[sortColumn] || "";
      columnB = b?.[sortColumn] || "";
    } else {
      columnA = a?.car?.[sortColumn] || "";
      columnB = b?.car?.[sortColumn] || "";
    }

    if (sortColumn === "name" || sortColumn === "brand") {
      return sortOrder === "asc"
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA);
    } else {
      if (columnA < columnB) return sortOrder === "asc" ? -1 : 1;
      if (columnA > columnB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  /*--Filter, Sort and Search-- */

  /* Api get cars */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
      <AdminNavarmenu />
      <div className={CarStatsCSS["CS-main-container"]}>
        <SuccessModal
          message={success}
          show={success !== ""}
          onClose={() => setSuccess("")}
        />
        <ErrorModal
          message={error}
          show={showError}
          onClose={() => {
            setShowError(false);
          }}
        />
        <AdminHeader
          headingName={
            notRentedCarSelected ? "Not Rented Cars" : "Frequently Rented Cars"
          }
        />

        {!notRentedCarSelected && (
          <div className={CarStatsCSS["CS-graph"]}>
            <BarChart
              data={getTopRentedCars(sortedUsers).map((car) => car.rentalCount)}
              labels={getTopRentedCars(sortedUsers).map((car) => `${car.name}`)}
            />
          </div>
        )}
        <Button
          className={CarStatsCSS["CS-insert-btn"]}
          onClick={() => {
            setNotRentedCarSelected((prevState) => !prevState);
          }}
          variant={notRentedCarSelected ? "outline-success" : "outline-danger"}
        >
          {notRentedCarSelected ? (
            <i className={`${CarStatsCSS["US-plus"]} fas fa-car`} />
          ) : (
            <i className={`${CarStatsCSS["US-plus"]} fa-solid fa-car-on`} />
          )}
          {notRentedCarSelected
            ? " View Frequently Rented Cars"
            : " View Not Rented Cars"}
        </Button>
        <div className={CarStatsCSS["CS-filter-container"]}>
          <Select
            className={CarStatsCSS["CS-filter-select"]}
            options={cars.map((car, index) => {
              const currentCar = notRentedCarSelected ? car : car.car;
              return {
                key: index,
                value: currentCar?.name || "",
                label: `${currentCar?.name} (${currentCar?.brand})`,
              };
            })}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = cars.slice(0, 5).map((car) => ({
                value: notRentedCarSelected ? car.name : car.car.name,
                label: notRentedCarSelected
                  ? `${car.name} (${car.brand})`
                  : `${car.car.name} (${car.car.brand})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by car name"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
        </div>

        <div className={CarStatsCSS["CS-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={CarStatsCSS["CS-table-row"]}>
                  <th>S.N.</th>
                  <th onClick={() => handleSort("name")}>
                    Car Name{" "}
                    {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "name" && "▼"}
                  </th>
                  <th onClick={() => handleSort("brand")}>
                    Car Brand{" "}
                    {sortColumn === "brand" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "brand" && "▼"}
                  </th>
                  <th>Actions </th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers.filter((car) =>
                  notRentedCarSelected
                    ? car?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : car?.car?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <EmptyDataInfo message="No cars found." />
                    </td>
                  </tr>
                ) : (
                  sortedUsers
                    .filter((car) =>
                      notRentedCarSelected
                        ? car?.name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        : car?.car?.name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    )
                    .map((car, index) => (
                      <tr
                        className={CarStatsCSS["CS-table-data-row"]}
                        key={notRentedCarSelected ? car.id : car.car.carId}
                      >
                        <td className={CarStatsCSS["CS-id-col"]}>
                          {index + 1}
                        </td>
                        <td>
                          {notRentedCarSelected ? car?.name : car?.car.name}
                        </td>
                        <td>
                          {notRentedCarSelected ? car.brand : car.car.brand}
                        </td>

                        <td className={CarStatsCSS["CS-action-col"]}>
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleView(
                                notRentedCarSelected ? car.id : car.car.carId
                              );
                            }}
                            className={CarStatsCSS["CS-btn"]}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
};
