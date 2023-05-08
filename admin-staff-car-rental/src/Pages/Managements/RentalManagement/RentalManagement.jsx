import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import RentalManagementCSS from "./RentalManagement.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { ConfirmModal } from "../../../Components/ConfirmModal/ConfirmModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const RentalManagement = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState("");
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authorizing, setAuthorizing] = useState({});
  const [requestId, setRequestId] = useState("");
  const [customerIdentity, setCustomerIdentity] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
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

  /*Filterinings, sorting and searching*/
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  const sortedRequests = [...pendingRequest].sort((a, b) => {
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

  /* Api get rental history */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/RentalHistory/get_rental_history?status=Pending`;
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          setPendingRequest(response.data.history);
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
            setError(error.response.message);
          }
        } else {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setPendingRequest, host]);

  const handleApproveDeny = async () => {
    setLoading(true);
    try {
      const endpoint =
        modalType === "approve"
          ? `${host}/api/RentalHistory/approve_request?requestId=${requestId}`
          : `${host}/api/RentalHistory/deny_request?requestId=${requestId}`;
      const response = await axios({
        method: "patch",
        url: endpoint,
        withCredentials: true,
      });

      if (response.status === 200 && modalType === "approve") {
        setSuccess("Request has been approved successfully");
        setShowConfirmModal(false);
        setPendingRequest(
          pendingRequest.filter((request) => request.id !== requestId)
        );
      }
      if (response.status === 200 && modalType === "deny") {
        setSuccess("Request has been denied successfully");
        setShowConfirmModal(false);
        setPendingRequest(
          pendingRequest.filter((request) => request.id !== requestId)
        );
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.message) {
          setError(error.response.message);
        } else if (
          error.response.data[0] &&
          error.response.data[0].description
        ) {
          setError(error.response.data[0].description);
        } else if (error.response.data) {
          setError(error.response.data);
        } else {
          setError(error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const Authorize = async (customerId, requestId) => {
    try {
      setAuthorizing((prevState) => ({ ...prevState, [requestId]: true }));
      const response = await axios({
        method: "post",
        url: `${host}/api/RentalHistory/bill_status?customerId=${customerId}`,
        withCredentials: true,
      });
      if (response.status === 200) {
        setShowError(false);
        if (response.data.billStatus === "Due") {
          setModalType("deny");
        } else {
          setModalType("approve");
        }
        setRequestId(requestId);
        setShowConfirmModal(true);
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
      setAuthorizing((prevState) => ({ ...prevState, [requestId]: false }));
    }
  };

  const uniqueDamageRequests = pendingRequest.reduce((acc, current) => {
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
      <div className={RentalManagementCSS["RM-main-container"]}>
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
          header={
            modalType === "deny"
              ? `Deny "${customerIdentity}'s" Request?`
              : `Approve "${customerIdentity}'s" Request?`
          }
          message={
            modalType === "deny"
              ? `You can deny ${customerIdentity}'s request as they have bills that needs to be paid.`
              : `The request from ${customerIdentity} can be accepted, as all bills have been paid.`
          }
          handleConfirmMethod={handleApproveDeny}
          showConfirmModal={showConfirmModal !== false}
          onClose={() => {
            setShowConfirmModal(false);
            setModalType("");
          }}
          buttonVariant={modalType === "deny" ? "danger" : "success"}
          isConfirming={loading}
        />
        <AdminHeader headingName="Rental Management" />
        <div className={RentalManagementCSS["RM-filter-container"]}>
          <Select
            className={RentalManagementCSS["RM-filter-select"]}
            options={uniqueDamageRequests.map((user) => ({
              value: user.customer.username,
              label: `${user.customer.username} (${user.customer.name})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = uniqueDamageRequests
                .slice(0, 5)
                .map((user) => ({
                  value: user.customer.username,
                  label: `${user.customer.username} (${user.customer.name})`,
                }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by username"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
        </div>

        <div className={RentalManagementCSS["RM-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={RentalManagementCSS["RM-table-row"]}>
                  <th>S.N.</th>
                  <th onClick={() => handleSort("username")}>
                    Username{" "}
                    {sortColumn === "username" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "username" && "▼"}
                  </th>
                  <th onClick={() => handleSort("name")}>
                    Full Name
                    {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "name" && "▼"}
                  </th>
                  <th>Car Name</th>
                  <th>Brand</th>
                  <th>Total Charge </th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {sortedRequests.filter((requests) =>
                requests.customer.username
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ).length > 0 ? (
                <tbody>
                  {sortedRequests
                    .filter((requests) =>
                      requests.customer.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((request, index) => (
                      <tr
                        className={RentalManagementCSS["RM-table-data-row"]}
                        key={request.id}
                      >
                        <td className={RentalManagementCSS["RM-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{request.customer.username}</td>
                        <td>{request.customer.name}</td>
                        <td>{request.car.name}</td>
                        <td>{request.car.brand}</td>
                        <td>{Math.round(request.totalCharge)}</td>
                        <td>{request.startDate}</td>
                        <td>{request.endDate}</td>
                        <td className={RentalManagementCSS["RM-action-col"]}>
                          <Button
                            variant="primary"
                            onClick={() => {
                              Authorize(request.customer.id, request.id);
                              setCustomerIdentity(
                                `[${request.customer.name}] ${request.customer.username}`
                              );
                            }}
                            className={RentalManagementCSS["RM-btn"]}
                          >
                            <i className="fas fa-id-card" />{" "}
                            {authorizing[request.id] ? (
                              <i className="fas fa-spinner fa-spin" />
                            ) : (
                              "Authorize"
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      <EmptyDataInfo />
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          )}
        </div>
      </div>
    </>
  );
};
