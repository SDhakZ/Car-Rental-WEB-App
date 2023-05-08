import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import ReturnCarCSS from "./ReturnCar.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { ReturnModal } from "./components/ReturnModal/ReturnModal";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const ReturnCar = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [returnCar, setReturnCar] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [sortColumn, setSortColumn] = useState("username");
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

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  const sortedOffers = [...returnCar].sort((a, b) => {
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

  /* Api get returnCar */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/RentalHistory/get_rental_history?status=Paid`;
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          setReturnCar(response.data.history);
          setShowErrorPage(false);
          setShowError(false);
        }
      } catch (error) {
        setShowErrorPage(true);
        setShowError(true);
        if (error.response && error.response.message) {
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
  }, [setReturnCar, host]);

  const uniqueDamageRequests = returnCar.reduce((acc, current) => {
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
      <div className={ReturnCarCSS["RC-main-container"]}>
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
        <AdminHeader headingName="Return Cars" />

        <div className={ReturnCarCSS["RC-filter-container"]}>
          <Select
            className={ReturnCarCSS["RC-filter-select"]}
            options={uniqueDamageRequests.map((request) => ({
              value: request.customer.username,
              label: `${request.customer.username} (${request.customer.name})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = uniqueDamageRequests
                .slice(0, 5)
                .map((request) => ({
                  value: request.customer.username,
                  label: `${request.customer.username} (${request.customer.name})`,
                }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by username"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
        </div>

        <div className={ReturnCarCSS["RC-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={ReturnCarCSS["RC-table-row"]}>
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
                  <th>Authorized By </th>
                  <th>Action </th>
                </tr>
              </thead>

              <tbody>
                {sortedOffers.filter((request) =>
                  request.customer.username
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

                    .filter((request) =>
                      request.customer.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((request, index) => (
                      <tr
                        className={ReturnCarCSS["RC-table-data-row"]}
                        key={request.id}
                      >
                        <td className={ReturnCarCSS["RH-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{request.customer.username}</td>
                        <td>{request.customer.name}</td>
                        <td>{request.car.name}</td>
                        <td>{request.car.brand}</td>
                        <td>Rs. {Math.round(request.totalCharge)}</td>
                        <td>{request.startDate}</td>
                        <td>{request.endDate}</td>
                        <td>
                          {request.requestStatus === "Cancelled"
                            ? "Cancelled by request"
                            : request.authorizedBy
                            ? request?.authorizedBy.username
                            : "Not authorized yet"}
                        </td>
                        <td className={ReturnCarCSS["RC-action-col"]}>
                          <Button
                            variant="success"
                            onClick={() => {
                              setRequestId(request.id);
                              setSelectedRequest(request);
                              setOpenModal(true);
                            }}
                            className={ReturnCarCSS["RC-btn"]}
                          >
                            <i className="fa fa-undo" />{" "}
                            <i className="fas fa-car" /> Return Car
                          </Button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          )}
        </div>
        <ReturnModal
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
            setSelectedRequest([]);
          }}
          setSuccess={setSuccess}
          setError={setError}
          setReturnCar={setReturnCar}
          returnCar={returnCar}
          selectedRequest={selectedRequest ? selectedRequest : ""}
          requestId={requestId}
        />
      </div>
    </>
  );
};
