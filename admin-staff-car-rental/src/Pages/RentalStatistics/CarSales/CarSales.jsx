import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import OfferManagementCSS from "./CarSales.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const CarSales = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [histories, setHistories] = useState([]);
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [limitedOptions, setLimitedOptions] = useState([]);

  // Filtering and sorting.
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

  const sortedOffers = [...histories].sort((a, b) => {
    const columnA = a?.customer?.[sortColumn] ?? "";
    const columnB = b?.customer?.[sortColumn] ?? "";
    if (sortColumn === "username" || sortColumn === "name") {
      return sortOrder === "asc"
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA);
    } else {
      if (columnA < columnB) return sortOrder === "asc" ? -1 : 1;
      if (columnA > columnB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  /* Api get histories */
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = `${host}/api/Sales/rentals_paid`;
      const response = await axios.post(
        url,
        {
          CustomerId: "",
          startDate: "",
          endDate: "",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setHistories(response.data.rentalData);
        setShowErrorPage(false);
        setShowError(false);
      }
    } catch (error) {
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
  }, [host]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filtering data from id, start date and end date
  const fetchFilteredData = async () => {
    setIsLoading(true);
    try {
      const url = `${host}/api/Sales/rentals_paid`;
      const response = await axios.post(
        url,
        {
          CustomerId: selectedUserId,
          startDate: new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }).format(startDate),
          endDate: new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }).format(endDate),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setHistories(response.data.rentalData);
        setShowErrorPage(false);
        setShowError(false);
      }
    } catch (error) {
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

  // Reset fields and fetch all data.
  const resetFields = () => {
    const areFieldsEmpty =
      !selectedUserId &&
      !searchTerm &&
      !selectedOption &&
      !startDate &&
      !endDate;

    if (!areFieldsEmpty) {
      setSelectedUserId("");
      setSearchTerm("");
      setSelectedOption(null);
      setStartDate(null);
      setEndDate(null);
      fetchAllData();
    }
  };

  const uniqueUserHistory = histories.reduce((acc, current) => {
    const x = acc.find(
      (item) => item.customer.username === current.customer.username
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return (
    <>
      <AdminNavbarmenu />
      <div className={OfferManagementCSS["RH-main-container"]}>
        <ErrorModal
          message={error}
          show={showError}
          onClose={() => {
            setShowError(false);
          }}
        />

        <AdminHeader headingName="Car sales" />
        <h3>Filter sales by username and date range</h3>
        <div className={OfferManagementCSS["RH-filter-container"]}>
          <Select
            className={OfferManagementCSS["RH-filter-select"]}
            options={uniqueUserHistory.map((user) => ({
              value: user.customer.username,
              label: `${user.customer.username} (${user.customer.name})`,
              id: user.customer.id,
            }))}
            value={selectedOption}
            onChange={(selectedOption) => {
              setSelectedOption(selectedOption);
              setSearchTerm(selectedOption ? selectedOption.value : "");
              setSelectedUserId(selectedOption ? selectedOption.id : "");
            }}
            onMenuOpen={() => {
              const top5Options = uniqueUserHistory.slice(0, 5).map((user) => ({
                value: user.customer.username,
                label: `${user.customer.username} (${user.customer.name})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search/Filter by username"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />

          <div className={OfferManagementCSS["RH-date-container"]}>
            <label>Start Date:</label>
            <DatePicker
              className={OfferManagementCSS["RH-date"]}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Enter start date"
            />
          </div>
          <div className={OfferManagementCSS["RH-date-container"]}>
            <label>End Date:</label>
            <DatePicker
              className={OfferManagementCSS["RH-date"]}
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Enter end date"
            />
          </div>
          <button
            className={OfferManagementCSS["RH-filter-button"]}
            onClick={fetchFilteredData}
          >
            Filter Data
          </button>
          <button
            className={OfferManagementCSS["RH-reset-button"]}
            onClick={resetFields}
          >
            Reset All Filters
          </button>
        </div>
        <div className={OfferManagementCSS["RH-dash"]}></div>

        <div className={OfferManagementCSS["RH-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={OfferManagementCSS["RH-table-row"]}>
                  <th>S.N.</th>
                  <th onClick={() => handleSort("username")}>
                    Username{" "}
                    {sortColumn === "username" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "username" && "▼"}
                  </th>
                  <th onClick={() => handleSort("name")}>
                    Full Name{" "}
                    {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "name" && "▼"}
                  </th>
                  <th>Car Name </th>
                  <th>Brand</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Authorized By</th>
                  <th>Total Charge</th>
                  <th>Payment Type</th>
                </tr>
              </thead>

              <tbody>
                {sortedOffers.filter((user) =>
                  user.customer.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      <EmptyDataInfo message="No cars found." />
                    </td>
                  </tr>
                ) : (
                  sortedOffers
                    .filter((user) =>
                      user.customer.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((user, index) => (
                      <tr
                        className={OfferManagementCSS["RH-table-data-row"]}
                        key={user.id}
                      >
                        <td className={OfferManagementCSS["RH-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{user.customer.username}</td>
                        <td>{user.customer.name}</td>
                        <td>{user.car.name}</td>
                        <td>{user.car.brand}</td>
                        <td>{user.startDate}</td>
                        <td>{user.endDate}</td>
                        <td>{`${user.authorizedBy.username} [${user.authorizedBy.name}]`}</td>
                        <td style={{ color: "green" }}>
                          Rs. {Math.round(user.totalCharge)}
                        </td>
                        <td
                          style={
                            user.paymentType === "Online"
                              ? { color: "#9b32a8" }
                              : { color: "#4278f5" }
                          }
                        >
                          {user.paymentType}
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
