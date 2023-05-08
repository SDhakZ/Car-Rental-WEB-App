import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import DPLogCSS from "./DPLogs.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const DamagePaymentLogs = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [histories, setHistories] = useState([]);
  const [error, setError] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const statusOptions = [
    { value: "", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Paid", label: "Paid" },
  ];
  const [limitedOptions, setLimitedOptions] = useState([]);

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

  const sortedTable = Array.isArray(histories)
    ? [...histories].sort((a, b) => {
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
      })
    : [];

  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption ? selectedOption.value : "");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { color: "blue" };
      case "Paid":
        return { color: "green" };
      default:
        return {};
    }
  };

  /*get damage payments api*/
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/DamagePayment/get_damage_payments`;
        const params = {};
        if (statusFilter) {
          params.paymentStatus = statusFilter;
        }
        const response = await axios.get(url, {
          withCredentials: true,
          params,
        });
        if (response.status === 200) {
          setHistories(response.data.payments);
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
  }, [setHistories, host, statusFilter]);

  const uniqueUserHistory = Array.isArray(histories)
    ? histories.reduce((acc, current) => {
        const x = acc.find(
          (item) =>
            item.rentalDetails.customer.username ===
            current.rentalDetails.customer.username
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [])
    : [];
  return (
    <>
      <AdminNavbarmenu />
      <div className={DPLogCSS["DPL-main-container"]}>
        <ErrorModal
          message={error}
          show={showError}
          onClose={() => {
            setShowError(false);
          }}
        />

        <AdminHeader headingName="Damage Payment Logs" />

        <div className={DPLogCSS["DPL-filter-container"]}>
          <Select
            className={DPLogCSS["DPL-filter-select"]}
            options={uniqueUserHistory.map((user) => ({
              value: user.rentalDetails.customer.username,
              label: `${user.rentalDetails.customer.username} (${user.rentalDetails.customer.name})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = uniqueUserHistory.slice(0, 5).map((user) => ({
                value: user.rentalDetails.customer.username,
                label: `${user.rentalDetails.customer.username} (${user.rentalDetails.customer.name})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by username"
            isClearable
            filterOption={customFilter}
          />
          <Select
            className={DPLogCSS["DPL-filter-select"]}
            options={statusOptions}
            onChange={handleStatusFilterChange}
            placeholder="Filter by Status"
            isClearable
          />
        </div>

        <div className={DPLogCSS["DPL-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={DPLogCSS["DPL-table-row"]}>
                  <th>S.N.</th>
                  <th onClick={() => handleSort("username")}>
                    Username{" "}
                    {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "name" && "▼"}
                  </th>
                  <th onClick={() => handleSort("name")}>
                    Customer Name
                    {sortColumn === "fullname" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "fullname" && "▼"}
                  </th>
                  <th>Car Name</th>
                  <th>Brand</th>
                  <th>Damage Charge</th>
                  <th>Checked By</th>
                  <th>Payment Status</th>
                  <th>Payment Type</th>
                </tr>
              </thead>

              <tbody>
                {sortedTable.filter((payments) =>
                  payments.rentalDetails.customer.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      <EmptyDataInfo message="No cars found." />
                    </td>
                  </tr>
                ) : (
                  sortedTable
                    .filter((payments) =>
                      payments.rentalDetails.customer.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((payment, index) => (
                      <tr
                        className={DPLogCSS["DPL-table-data-row"]}
                        key={payment.id}
                      >
                        <td className={DPLogCSS["DPL-id-col"]}>{index + 1}</td>
                        <td>{payment.rentalDetails.customer.username}</td>
                        <td>{payment.rentalDetails.customer.name}</td>
                        <td>{payment.rentalDetails.car.name}</td>
                        <td>{payment.rentalDetails.car.brand}</td>
                        <td>{Math.round(payment.amount)}</td>
                        <td>{payment.checkedBy.username}</td>
                        <td style={getStatusStyle(payment.paymentStatus)}>
                          {payment.paymentStatus}
                        </td>
                        <td
                          style={
                            payment.paymentType === "Online"
                              ? { color: "#c540d6" }
                              : payment.paymentType === "Offline"
                              ? { color: "#4278f5" }
                              : { color: "#9b32a8" }
                          }
                        >
                          {payment.paymentType
                            ? payment.paymentType
                            : "Not Paid"}
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
