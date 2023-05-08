import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import DamageRequestCSS from "./DamageRequest.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { DamageModal } from "./components/DamageModal/DamageModal";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import { ViewDetailModal } from "./components/ViewDetailModal/ViewDetailModal";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";
export const DamageRequest = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [damageRequests, setDamageRequests] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [logSelected, setLogSelected] = useState(false);
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

  const sortedOffers = [...damageRequests].sort((a, b) => {
    const columnA = a?.rentalDetails.customer?.[sortColumn] ?? "";
    const columnB = b?.rentalDetails.customer?.[sortColumn] ?? "";
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

  /* Api get damageRequests */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/DamageRequest/get_all_req?requestStatus=Pending`;
        if (logSelected) {
          url = `${host}/api/DamageRequest/get_all_req`;
        }
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          setDamageRequests(response.data.damageRequests);
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
  }, [setDamageRequests, host, logSelected]);

  const uniqueDamageRequests = damageRequests.reduce((acc, current) => {
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
  }, []);

  return (
    <>
      <AdminNavbarmenu />
      <div className={DamageRequestCSS["DR-main-container"]}>
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
        <ViewDetailModal
          selectedRequest={selectedRequest}
          header="Damage Details"
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRequest([]);
          }}
          showDetailModal={showDetailModal !== false}
        />
        <AdminHeader headingName="Damage requests" />
        <Button
          className={DamageRequestCSS["DR-insert-btn"]}
          onClick={() => {
            setLogSelected((prevState) => !prevState);
          }}
          variant={logSelected ? "outline-primary" : "outline-success"}
        >
          {logSelected ? (
            <i
              className={`${DamageRequestCSS["DR-plus"]} fa-solid fa-calendar-check`}
            />
          ) : (
            <i
              className={`${DamageRequestCSS["DR-plus"]} fa-solid fa-th-list`}
            />
          )}
          {logSelected ? "View Pending Request" : "View All Requests"}
        </Button>
        <div className={DamageRequestCSS["DR-filter-container"]}>
          <Select
            className={DamageRequestCSS["DR-filter-select"]}
            options={uniqueDamageRequests.map((request) => ({
              value: request.rentalDetails.customer.username,
              label: `${request.rentalDetails.customer.username} (${request.rentalDetails.customer.name})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = uniqueDamageRequests
                .slice(0, 5)
                .map((request) => ({
                  value: request.rentalDetails.customer.username,
                  label: `${request.rentalDetails.customer.username} (${request.rentalDetails.customer.name})`,
                }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by username"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
        </div>

        <div className={DamageRequestCSS["DR-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={DamageRequestCSS["DR-table-row"]}>
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
                  <th>Damage Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedOffers.filter((request) =>
                  request.rentalDetails.customer.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      <EmptyDataInfo message="No cars found." />
                    </td>
                  </tr>
                ) : (
                  sortedOffers

                    .filter((request) =>
                      request.rentalDetails.customer.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((request, index) => (
                      <tr
                        className={DamageRequestCSS["DR-table-data-row"]}
                        key={request.id}
                      >
                        <td className={DamageRequestCSS["DR-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{request.rentalDetails.customer.username}</td>
                        <td>{request.rentalDetails.customer.name}</td>
                        <td>{request.rentalDetails.car.name}</td>
                        <td>{request.rentalDetails.car.brand}</td>
                        <td className={DamageRequestCSS["DR-desc-col"]}>
                          {request.damageDescription}
                        </td>
                        <td className={DamageRequestCSS["DR-action-col"]}>
                          <div className={DamageRequestCSS["DR-action-div"]}>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setShowDetailModal(true);
                                setSelectedRequest(request);
                              }}
                              className={DamageRequestCSS["DR-btn"]}
                            >
                              <i className="fa-solid fa-eye" /> View details
                            </Button>
                            {logSelected ? (
                              ""
                            ) : (
                              <Button
                                variant="success"
                                onClick={() => {
                                  setRequestId(request.id);
                                  setSelectedRequest(request);
                                  setOpenModal(true);
                                }}
                                className={DamageRequestCSS["DR-btn"]}
                              >
                                <i className="fas fa-money-check-alt" /> Send
                                Damage Bill
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          )}
        </div>
        <DamageModal
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
            setSelectedRequest([]);
          }}
          setSuccess={setSuccess}
          setError={setError}
          setDamageRequests={setDamageRequests}
          damageRequests={damageRequests}
          selectedRequest={selectedRequest ? selectedRequest : ""}
          requestId={requestId}
        />
      </div>
    </>
  );
};
