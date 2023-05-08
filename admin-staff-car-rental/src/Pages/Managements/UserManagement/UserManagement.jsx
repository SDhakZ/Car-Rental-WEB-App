import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import UserManagementCSS from "./UserManagement.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import {
  IUModalUser,
  ChangePasswordModal,
} from "./components/InsertUpdateModal/IUModalUser";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { ConfirmModal } from "../../../Components/ConfirmModal/ConfirmModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const UserManagement = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openPassModal, setOpenPassModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  /* Delete */
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  /* Update */
  const [updateID, setUpdateID] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  /* Filers */
  const [sortOrder, setSortOrder] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("username");
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
  const sortedUsers = [...users].sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    if (sortColumn === "fullName" || sortColumn === "username") {
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
        const response = await axios.get(`${host}/api/Admin/get_staffs`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUsers(response.data.users);
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
  }, [setUsers, host]);

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setDeleteID(id);
  };

  const handleConfirmDelete = async () => {
    console.log(deleteID);
    try {
      setIsDeleting(true);
      const response = await axios.delete(`${host}/api/Admin/${deleteID}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setShowConfirmModal(false);
        setUsers(users.filter((user) => user.id !== deleteID));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <AdminNavbarmenu />
      <div className={UserManagementCSS["UM-main-container"]}>
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
        <AdminHeader headingName="User management" />
        <Button
          className={UserManagementCSS["UM-insert-btn"]}
          onClick={() => {
            setOpenModal(true);
            setModalType("Insert");
          }}
        >
          <i className={`${UserManagementCSS["UM-plus"]} fa fa-plus`} />
          Register User
        </Button>
        <div className={UserManagementCSS["UM-filter-container"]}>
          <Select
            className={UserManagementCSS["UM-filter-select"]}
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

          <div className={UserManagementCSS["UM-filter"]}>
            <label htmlFor="roleFilter">Filter By Role:</label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={UserManagementCSS["UM-dropdown"]}
            >
              <option value="">All</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <div className={UserManagementCSS["UM-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message="Server Error" />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={UserManagementCSS["UM-table-row"]}>
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
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th onClick={() => handleSort("address")}>
                    Address{" "}
                    {sortColumn === "address" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "address" && "▼"}
                  </th>
                  <th onClick={() => handleSort("role")}>
                    Role{" "}
                    {sortColumn === "role" && (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "role" && "▼"}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers
                  .filter((user) =>
                    user?.username
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .filter((user) =>
                    roleFilter ? user.role === roleFilter : true
                  ).length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyDataInfo />
                    </td>
                  </tr>
                ) : (
                  sortedUsers
                    .filter((user) =>
                      user?.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .filter((user) =>
                      roleFilter ? user.role === roleFilter : true
                    )
                    .map((user, index) => (
                      <tr
                        className={
                          user.username === "admin"
                            ? `${UserManagementCSS["UM-table-data-row"]} ${UserManagementCSS["UM-admin-row"]}`
                            : UserManagementCSS["UM-table-data-row"]
                        }
                        key={user.id}
                      >
                        <td className={UserManagementCSS["UM-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{user.username}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.address}</td>
                        <td
                          style={{
                            color: user.role === "Admin" ? "red" : "blue",
                          }}
                        >
                          {user.role}
                        </td>

                        <td className={UserManagementCSS["UM-action-col"]}>
                          <Button
                            variant="success"
                            disabled={user.username === "admin"}
                            onClick={() => {
                              setOpenModal(true);
                              setModalType("Update");
                              setUpdateID(user.id);
                              setSelectedUser(user);
                            }}
                            className={UserManagementCSS["UM-btn"]}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            onClick={() => {
                              setOpenPassModal(true);
                              setUpdateID(user.id);
                            }}
                            className={UserManagementCSS["UM-cp-btn"]}
                            disabled={user.username === "admin"}
                          >
                            <i className="fa fa-repeat" aria-hidden="true"></i>
                            <i className="fa fa-key" aria-hidden="true"></i>
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleDelete(user.id);
                            }}
                            className={UserManagementCSS["UM-btn"]}
                            disabled={user.username === "admin"}
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
        <IUModalUser
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
            setSelectedUser([]);
          }}
          setSuccess={setSuccess}
          setError={setError}
          setShowError={setShowError}
          setUsers={setUsers}
          users={users}
          modalType={modalType}
          selectedUser={selectedUser ? selectedUser : ""}
          updateID={updateID}
        />
        <ChangePasswordModal
          show={openPassModal}
          handleClose={() => {
            setOpenPassModal(false);
          }}
          setSuccess={setSuccess}
          setError={setError}
          setShowError={setShowError}
          userId={updateID}
        />
      </div>
    </>
  );
};
