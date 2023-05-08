import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import AdminNavarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import UserStatsCSS from "./UserStats.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import axios from "axios";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const UserStats = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [limitedOptions, setLimitedOptions] = useState([]);
  const [inactiveCustomerSelected, setInactiveCustomerSelected] =
    useState(false);

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

  const sortedUsers = [...users].sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    if (sortColumn === "username" || sortColumn === "fullName") {
      return sortOrder === "asc"
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA);
    } else {
      if (columnA < columnB) return sortOrder === "asc" ? -1 : 1;
      if (columnA > columnB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  /* Api get users */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/CarRental/regular_customers`;
        if (inactiveCustomerSelected) {
          url = `${host}/api/CarRental/inactive_customers`;
        }
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          inactiveCustomerSelected
            ? setUsers(response.data.inactiveCustomers)
            : setUsers(response.data.regularCustomers);
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
  }, [setUsers, host, inactiveCustomerSelected]);

  return (
    <>
      <AdminNavarmenu />
      <div className={UserStatsCSS["US-main-container"]}>
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
            inactiveCustomerSelected
              ? "Inactive Customers"
              : "Frequent Customers"
          }
        />
        <Button
          className={UserStatsCSS["US-insert-btn"]}
          onClick={() => {
            setInactiveCustomerSelected((prevState) => !prevState);
          }}
          variant={
            inactiveCustomerSelected ? "outline-success" : "outline-danger"
          }
        >
          {inactiveCustomerSelected ? (
            <i className={`${UserStatsCSS["US-plus"]} fas fa-user`} />
          ) : (
            <i className={`${UserStatsCSS["US-plus"]} fas fa-user-slash`} />
          )}
          {inactiveCustomerSelected
            ? "View Frequent Customers"
            : "View Inactive Customers"}
        </Button>

        <div className={UserStatsCSS["US-filter-container"]}>
          <Select
            className={UserStatsCSS["US-filter-select"]}
            options={users.map((user) => ({
              value: user.username,
              label: `${user.username} (${user.fullName})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = users.slice(0, 5).map((user) => ({
                value: user.username,
                label: `${user.username} (${user.fullName})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by username"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
        </div>

        <div className={UserStatsCSS["US-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={UserStatsCSS["US-table-row"]}>
                  <th>S.N.</th>
                  <th onClick={() => handleSort("username")}>
                    Username{" "}
                    {sortColumn === "username" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "username" && "▼"}
                  </th>
                  <th onClick={() => handleSort("fullName")}>
                    Full Name{" "}
                    {sortColumn === "fullName" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "fullName" && "▼"}
                  </th>
                  <th>Email </th>
                  <th>Phone Number </th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers.filter((user) =>
                  user.username.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      <EmptyDataInfo message="No cars found." />
                    </td>
                  </tr>
                ) : (
                  sortedUsers
                    .filter((user) =>
                      user.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((user, index) => (
                      <tr
                        className={UserStatsCSS["US-table-data-row"]}
                        key={user.id}
                      >
                        <td className={UserStatsCSS["US-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{user.username}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
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
