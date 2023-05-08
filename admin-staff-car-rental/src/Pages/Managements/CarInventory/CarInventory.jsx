import React, { useState, useEffect, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import CarInventoryCSS from "./CarInventory.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { IUModal } from "./components/InsertUpdateModal/IUModal";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { ConfirmModal } from "../../../Components/ConfirmModal/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";
import { AuthContext } from "../../../Hooks/AuthProvider";
import Select from "react-select";
export const CarInventory = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  /* Delete */
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  /* Update */
  const [updateID, setUpdateID] = useState("");
  const [selectedCar, setSelectedCar] = useState([]);
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("carName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [fuelType, setFuelType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [limitedOptions, setLimitedOptions] = useState([]);
  const { user } = useContext(AuthContext);
  const role = user && user.role ? user.role : null;
  const [status, setStatus] = useState("");

  /*Filterinings, sorting and searching*/
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

  const sortedCars = [...cars].sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    if (sortColumn === "carName" || sortColumn === "brand") {
      return sortOrder === "asc"
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA);
    } else {
      if (columnA < columnB) return sortOrder === "asc" ? -1 : 1;
      if (columnA > columnB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  /* Api get cars */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${host}/api/Car/get_cars`, {
          params: {
            fuelType: fuelType,
            status: status,
          },
        });
        if (response.status === 200) {
          setCars(response.data.cars);
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
  }, [setCars, host, fuelType, status]);

  const handleView = (id) => {
    let path = `/IndividualCarDetail/${id}`;
    navigate(path, { state: { from: "/CarManagement" } });
  };

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setDeleteID(id);
  };

  const handleConfirmDelete = async () => {
    console.log(deleteID);
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${host}/api/Car/remove_car?id=${deleteID}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setShowConfirmModal(false);
        setCars(cars.filter((car) => car.id !== deleteID));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  const handleStatusChange = async (e) => {
    setStatus(e.target.value);
  };

  const handleFuelTypeChange = async (e) => {
    setFuelType(e.target.value);
  };
  const handleReset = () => {
    setFuelType("");
    setStatus("");
    setSearchTerm("");
  };

  return (
    <>
      <AdminNavbarmenu />
      <div className={CarInventoryCSS["CM-main-container"]}>
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
        <ConfirmModal
          header="Are you sure you want to delete this item?"
          message="After deletion the data will be deleted from the database"
          handleConfirmMethod={handleConfirmDelete}
          showConfirmModal={showConfirmModal !== false}
          onClose={() => setShowConfirmModal(false)}
          isConfirming={isDeleting}
        />
        <AdminHeader headingName="Car management" />
        <Button
          className={CarInventoryCSS["CM-insert-btn"]}
          onClick={() => {
            setOpenModal(true);
            setModalType("Insert");
          }}
        >
          <i className={`${CarInventoryCSS["CM-plus"]} fa fa-plus`} />
          Insert Car
        </Button>
        <div className={CarInventoryCSS["CM-filter-container"]}>
          <Select
            className={CarInventoryCSS["CM-filter-select"]}
            options={cars.map((car) => ({
              value: car.carName,
              label: `${car.carName} (${car.brand})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = cars.slice(0, 5).map((car) => ({
                value: car.carName,
                label: `${car.carName} (${car.brand})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by Car Name"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
          <div className={CarInventoryCSS["CM-filter"]}>
            <label htmlFor="fuelType">Fuel Type:</label>
            <select
              id="fuelType"
              value={fuelType}
              onChange={handleFuelTypeChange}
              className={CarInventoryCSS["CM-dropdown"]}
            >
              <option value="">All</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className={CarInventoryCSS["CM-filter"]}>
            <label htmlFor="availability">Availability:</label>
            <select
              id="availability"
              value={status}
              onChange={handleStatusChange}
              className={CarInventoryCSS["CM-dropdown"]}
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Rented">Rented</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
          <button className={CarInventoryCSS["CM-reset"]} onClick={handleReset}>
            Reset Filters
          </button>
        </div>

        <div className={CarInventoryCSS["CM-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={CarInventoryCSS["CM-table-row"]}>
                  <th>S.N.</th>
                  <th onClick={() => handleSort("carName")}>
                    Car Name{" "}
                    {sortColumn === "carName" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "carName" && "▼"}
                  </th>
                  <th onClick={() => handleSort("brand")}>
                    Brand{" "}
                    {sortColumn === "brand" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "brand" && "▼"}
                  </th>
                  <th onClick={() => handleSort("mileage")}>
                    Mileage{" "}
                    {sortColumn === "mileage" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "mileage" && "▼"}
                  </th>
                  <th onClick={() => handleSort("fuelType")}>
                    Fuel Type{" "}
                    {sortColumn === "fuelType" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "fuelType" && "▼"}
                  </th>
                  <th onClick={() => handleSort("ratePerDay")}>
                    Daily Rate{" "}
                    {sortColumn === "ratePerDay" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "ratePerDay" && "▼"}
                  </th>{" "}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedCars.filter((car) =>
                  car.carName.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      <EmptyDataInfo message="No cars found." />
                    </td>
                  </tr>
                ) : (
                  sortedCars
                    .filter((car) =>
                      car.carName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((car, index) => (
                      <tr
                        className={CarInventoryCSS["CM-table-data-row"]}
                        key={car.id}
                      >
                        <td className={CarInventoryCSS["CM-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{car.carName}</td>
                        <td>{car.brand}</td>
                        <td>
                          {car.mileage}{" "}
                          {car.fuelType === "Electric" ? "km/kWh" : "km/l"}
                        </td>

                        <td>{car.fuelType}</td>
                        <td>Rs. {car.ratePerDay}</td>
                        <td
                          style={{
                            color:
                              car.status === "Available"
                                ? "green"
                                : car.status === "Damaged"
                                ? "red"
                                : car.status === "Rented"
                                ? "blue"
                                : "orange",
                            fontWeight: "600",
                          }}
                        >
                          {car.status}
                        </td>
                        <td className={CarInventoryCSS["CM-action-col"]}>
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleView(car.id);
                            }}
                            className={CarInventoryCSS["CM-btn"]}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Button>
                          {role === "Admin" && (
                            <Button
                              variant="success"
                              onClick={() => {
                                setOpenModal(true);
                                setModalType("Update");
                                setUpdateID(car.id);
                                setSelectedCar(car);
                              }}
                              className={CarInventoryCSS["CM-btn"]}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleDelete(car.id);
                            }}
                            className={CarInventoryCSS["CM-btn"]}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          )}
        </div>
        <IUModal
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
            setSelectedCar([]);
          }}
          setSuccess={setSuccess}
          setShowErrorPage={setShowErrorPage}
          setError={setError}
          setCars={setCars}
          cars={cars}
          modalType={modalType}
          selectedCar={selectedCar ? selectedCar : ""}
          updateID={updateID}
        />
      </div>
    </>
  );
};
