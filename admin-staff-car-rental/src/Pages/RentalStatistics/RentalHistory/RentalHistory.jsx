import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import OfferManagementCSS from "./RentalHistory.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const RentalHistory = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [histories, setHistories] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const statusOptions = [
    { value: "", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Denied", label: "Denied" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Paid", label: "Paid" },
  ];
  const [limitedOptions, setLimitedOptions] = useState([]);

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

  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption ? selectedOption.value : "");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return { color: "green" };
      case "Returned":
        return { color: "#7e1f91" };
      case "Pending":
        return { color: "blue" };
      case "Cancelled":
        return { color: "orange" };
      case "Paid":
        return { color: "#e6cf39" };
      case "Denied":
        return { color: "red" };
      default:
        return {};
    }
  };

  /* Api get histories */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/RentalHistory/get_rental_history`;
        const params = {};
        if (statusFilter) {
          params.status = statusFilter;
        }
        if (selectedUser) {
          params.userId = selectedUser;
        }
        const response = await axios.get(url, {
          withCredentials: true,
          params,
        });
        if (response.status === 200) {
          setHistories(response.data.history);
          setShowErrorPage(false);
          setShowError(false);
        }
      } catch (error) {
        setError(error.response.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setHistories, host, statusFilter, selectedUser]);

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

        <AdminHeader headingName="Rental History" />

        <div className={OfferManagementCSS["RH-filter-container"]}>
          <Select
            className={OfferManagementCSS["RH-filter-select"]}
            options={uniqueUserHistory.map((user) => ({
              value: user.customer.id,
              label: `${user.customer.username} (${user.customer.name})`,
            }))}
            onChange={(selectedOption) => {
              setSelectedUser(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = uniqueUserHistory.slice(0, 5).map((user) => ({
                value: user.customer.id,
                label: `${user.customer.username} (${user.customer.name})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by username"
            isClearable
            filterOption={customFilter}
          />
          <Select
            className={OfferManagementCSS["RH-filter-select"]}
            options={statusOptions}
            onChange={handleStatusFilterChange}
            placeholder="Filter by Status"
            isClearable
          />
        </div>

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
                  <th>Total Charge</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Authorized By </th>
                </tr>
              </thead>

              <tbody>
                {sortedOffers.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      <EmptyDataInfo message="No cars found." />
                    </td>
                  </tr>
                ) : (
                  sortedOffers.map((user, index) => (
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
                      <td>Rs. {Math.round(user.totalCharge)}</td>
                      <td>{user.startDate}</td>
                      <td>{user.endDate}</td>
                      <td style={getStatusStyle(user.requestStatus)}>
                        {user.requestStatus}
                      </td>
                      <td>
                        {user.requestStatus === "Cancelled"
                          ? "Cancelled by customer"
                          : user.authorizedBy
                          ? user?.authorizedBy.username
                          : "Not authorized yet"}
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
