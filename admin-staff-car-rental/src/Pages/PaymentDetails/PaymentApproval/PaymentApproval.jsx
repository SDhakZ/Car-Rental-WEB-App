import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import PaymentApprovalCSS from "./PaymentApproval.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { ConfirmModal } from "../../../Components/ConfirmModal/ConfirmModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import { DamagePaymentApproval } from "./DamagePaymentApproval";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const PaymentApproval = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [limitedOptions, setLimitedOptions] = useState([]);
  const [damagePaymentSelected, setDamagePaymentSelected] = useState(false);

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

  const sortedTable = [...payments].sort((a, b) => {
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

  /* Api get payments */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/RentalPayment/rental_payments?paymentStatus=Pending`;
        if (damagePaymentSelected) {
          url = `${host}/api/DamagePayment/get_damage_payments?paymentStatus=Pending`;
        }
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          setUsers(response.data.payments);
          setPayments(response.data.payments);
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
  }, [setPayments, host, damagePaymentSelected]);

  /* Api confirm */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      let endpoint = `${host}/api/RentalPayment/confirm_payment?paymentId=${paymentId}`;

      if (damagePaymentSelected) {
        endpoint = `${host}/api/DamagePayment/confirm_payment?paymentId=${paymentId}`;
      }
      const response = await axios({
        method: "put",
        url: endpoint,
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess("Payment has been confirmed successfully");
        setShowConfirmModal(false);
        setPayments(payments.filter((payment) => payment.id !== paymentId));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          setError(error.response.data.message);
        } else if (
          error.response.data[0] &&
          error.response.data[0].description
        ) {
          setError(error.response.data[0].description);
        } else {
          setError(error.message);
        }
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbarmenu />
      <div className={PaymentApprovalCSS["PA-main-container"]}>
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
          header="Confirm Payment?"
          message="Are you sure you want to confirm the payment?"
          handleConfirmMethod={handleConfirm}
          showConfirmModal={showConfirmModal !== false}
          onClose={() => {
            setShowConfirmModal(false);
          }}
          buttonVariant="success"
          isConfirming={loading}
        />
        <AdminHeader
          headingName={
            damagePaymentSelected
              ? "Damage Payment Approval"
              : "Payment Approval"
          }
        />

        <Button
          className={PaymentApprovalCSS["PA-insert-btn"]}
          onClick={() => {
            setDamagePaymentSelected((prevState) => !prevState);
          }}
          variant={damagePaymentSelected ? "outline-success" : "outline-danger"}
        >
          {damagePaymentSelected ? (
            <i className={`${PaymentApprovalCSS["PA-plus"]} fas fa-car`} />
          ) : (
            <i
              className={`${PaymentApprovalCSS["PA-plus"]} fa-solid fa-car-burst`}
            />
          )}
          {damagePaymentSelected ? "View Payments" : "View Damage Payments"}
        </Button>
        <div className={PaymentApprovalCSS["PA-filter-container"]}>
          <Select
            className={PaymentApprovalCSS["PA-filter-select"]}
            options={users.map((user) => ({
              value: user.rentalDetails.customer.username,
              label: `${user.rentalDetails.customer.username} (${user.rentalDetails.customer.name})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = users.slice(0, 5).map((user) => ({
                value: user.rentalDetails.customer.username,
                label: `${user.rentalDetails.customer.username} (${user.rentalDetails.customer.name})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by username"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
        </div>

        <div className={PaymentApprovalCSS["PA-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : damagePaymentSelected ? (
            <DamagePaymentApproval
              payments={payments}
              setPaymentId={setPaymentId}
              setShowConfirmModal={setShowConfirmModal}
              handleSort={handleSort}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              sortedTable={sortedTable}
              searchTerm={searchTerm}
              handleConfirm={handleConfirm}
            />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={PaymentApprovalCSS["PA-table-row"]}>
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedTable.filter((payments) =>
                  payments.rentalDetails.customer.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
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
                        className={PaymentApprovalCSS["PA-table-data-row"]}
                        key={payment.id}
                      >
                        <td className={PaymentApprovalCSS["PA-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{payment.rentalDetails.customer.username}</td>
                        <td>{payment.rentalDetails.customer.name}</td>
                        <td>{payment.rentalDetails.car.name}</td>
                        <td>{payment.rentalDetails.car.brand}</td>
                        <td>{Math.round(payment.amount)}</td>
                        <td className={PaymentApprovalCSS["PA-action-col"]}>
                          <Button
                            variant="primary"
                            onClick={() => {
                              setPaymentId(payment.id);
                              setShowConfirmModal(true);
                            }}
                            className={PaymentApprovalCSS["PA-btn"]}
                          >
                            <i className="fas fa-check-circle" /> Approve
                            Payment
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
