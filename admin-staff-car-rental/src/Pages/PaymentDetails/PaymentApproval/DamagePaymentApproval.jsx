import React from "react";
import PaymentApprovalCSS from "./PaymentApproval.module.css";
import { Table, Button } from "react-bootstrap";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const DamagePaymentApproval = (props) => {
  const {
    setPaymentId,
    setShowConfirmModal,
    handleSort,
    sortColumn,
    sortOrder,
    sortedTable,
    searchTerm,
  } = props;
  return (
    <Table striped bordered hover>
      <thead>
        <tr className={PaymentApprovalCSS["PA-table-row"]}>
          <th>S.N.</th>
          <th onClick={() => handleSort("username")}>
            Username{" "}
            {sortColumn === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            {sortColumn !== "name" && "▼"}
          </th>
          <th onClick={() => handleSort("name")}>
            Full Name
            {sortColumn === "fullname" && (sortOrder === "asc" ? "▲" : "▼")}
            {sortColumn !== "fullname" && "▼"}
          </th>
          <th>Car Name</th>
          <th>Brand</th>
          <th>Damage Charge</th>
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
            <td colSpan="8" style={{ textAlign: "center" }}>
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
                <td className={PaymentApprovalCSS["PA-id-col"]}>{index + 1}</td>
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
                    <i className="fas fa-check-circle" /> Approve Payment
                  </Button>
                </td>
              </tr>
            ))
        )}
      </tbody>
    </Table>
  );
};
