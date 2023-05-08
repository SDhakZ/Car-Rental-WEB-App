import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import AdminNavbarmenu from "../../../Layouts/AdminNavbar/AdminNavbarmenu";
import OfferManagementCSS from "./OfferManagement.module.css";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import { IUSpecialOfferModal } from "./components/InsertUpdateModal/IUSpecialOfferModal";
import { SuccessModal } from "../../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../../Components/ErrorModal/ErrorModal";
import { ConfirmModal } from "../../../Components/ConfirmModal/ConfirmModal";
import { LoadingPage } from "../../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import Select from "react-select";
import { EmptyDataInfo } from "../../../Components/EmptyDataInfo/EmptyDataInfo";

export const OfferManagement = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [showError, setShowError] = useState(false);
  /* Delete */
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  /* Update */
  const [updateID, setUpdateID] = useState("");
  const [selectedOffer, setSelectedOffer] = useState([]);
  const [sortColumn, setSortColumn] = useState("offerTitle");
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

  const sortedOffers = [...offers].sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    if (sortColumn === "offerTitle" || sortColumn === "brand") {
      return sortOrder === "asc"
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA);
    } else {
      if (columnA < columnB) return sortOrder === "asc" ? -1 : 1;
      if (columnA > columnB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  /* Api get offers */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/SpecialOffers/get_valid_offers`;
        if (logSelected) {
          url = `${host}/api/SpecialOffers/get_all_offers`;
        }
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          setOffers(response.data.offer);
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
  }, [setOffers, host, logSelected]);

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setDeleteID(id);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${host}/api/SpecialOffers/delete_offer?id=${deleteID}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setShowConfirmModal(false);
        setOffers(offers.filter((offer) => offer.id !== deleteID));
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
      <div className={OfferManagementCSS["SO-main-container"]}>
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
        <AdminHeader headingName="Special Offer" />
        <Button
          className={OfferManagementCSS["SO-insert-btn"]}
          onClick={() => {
            setOpenModal(true);
            setModalType("Insert");
          }}
        >
          <i className={`${OfferManagementCSS["SO-plus"]} fa fa-plus`} />
          Post Offer
        </Button>
        <Button
          className={OfferManagementCSS["SO-insert-btn"]}
          onClick={() => {
            setLogSelected((prevState) => !prevState);
          }}
          variant={logSelected ? "outline-primary" : "outline-success"}
        >
          {logSelected ? (
            <i
              className={`${OfferManagementCSS["SO-plus"]} fa-solid fa-calendar-check`}
            />
          ) : (
            <i
              className={`${OfferManagementCSS["SO-plus"]} fa-solid fa-th-list`}
            />
          )}
          {logSelected ? "View Current Offers" : "View All Offers"}
        </Button>
        <div className={OfferManagementCSS["SO-filter-container"]}>
          <Select
            className={OfferManagementCSS["SO-filter-select"]}
            options={offers.map((offer) => ({
              value: offer.offerTitle,
              label: `${offer.offerTitle} (${offer.carName})`,
            }))}
            onChange={(selectedOption) => {
              setSearchTerm(selectedOption ? selectedOption.value : "");
            }}
            onMenuOpen={() => {
              const top5Options = offers.slice(0, 5).map((offer) => ({
                value: offer.offerTitle,
                label: `${offer.offerTitle} (${offer.carName})`,
              }));
              setLimitedOptions(top5Options);
            }}
            placeholder="Search by Offer Title"
            isClearable
            onInputChange={(inputValue) => setSearchTerm(inputValue)}
            filterOption={customFilter}
          />
        </div>

        <div className={OfferManagementCSS["SO-table"]}>
          {isLoading === true ? (
            <LoadingPage />
          ) : showErrorPage ? (
            <ErrorPage message={error} />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr className={OfferManagementCSS["SO-table-row"]}>
                  <th>S.N.</th>
                  <th onClick={() => handleSort("offerTitle")}>
                    Offer Title{" "}
                    {sortColumn === "offerTitle" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "offerTitle" && "▼"}
                  </th>
                  <th onClick={() => handleSort("carName")}>
                    Car Name{" "}
                    {sortColumn === "carName" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "carName" && "▼"}
                  </th>
                  <th>Offer Description </th>
                  <th onClick={() => handleSort("discount")}>
                    Discount{" "}
                    {sortColumn === "discount" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                    {sortColumn !== "discount" && "▼"}
                  </th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  {logSelected ? "" : <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {sortedOffers.filter((offer) =>
                  offer.offerTitle
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td
                      colSpan={logSelected ? "7" : "8"}
                      style={{ textAlign: "center" }}
                    >
                      <EmptyDataInfo message="No offers found." />
                    </td>
                  </tr>
                ) : (
                  sortedOffers

                    .filter((offer) =>
                      offer.offerTitle
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((offer, index) => (
                      <tr
                        className={OfferManagementCSS["SO-table-data-row"]}
                        key={offer.id}
                      >
                        <td className={OfferManagementCSS["SO-id-col"]}>
                          {index + 1}
                        </td>
                        <td>{offer.offerTitle}</td>
                        <td>{offer.carName}</td>
                        <td>{offer.offerDescription}</td>
                        <td>{offer.discount}</td>
                        <td>{offer.startDate}</td>
                        <td>{offer.endDate}</td>
                        {logSelected ? (
                          ""
                        ) : (
                          <td className={OfferManagementCSS["SO-action-col"]}>
                            <Button
                              variant="success"
                              onClick={() => {
                                setOpenModal(true);
                                setModalType("Update");
                                setUpdateID(offer.id);
                                setSelectedOffer(offer);
                              }}
                              className={OfferManagementCSS["SO-btn"]}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => {
                                handleDelete(offer.id);
                              }}
                              className={OfferManagementCSS["SO-btn"]}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          )}
        </div>
        <IUSpecialOfferModal
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
            setSelectedOffer([]);
          }}
          setSuccess={setSuccess}
          setError={setError}
          setOffers={setOffers}
          offers={offers}
          modalType={modalType}
          selectedOffer={selectedOffer ? selectedOffer : ""}
          updateID={updateID}
        />
      </div>
    </>
  );
};
