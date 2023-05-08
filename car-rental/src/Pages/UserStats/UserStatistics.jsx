import React, { useContext, useState } from "react";
import { Header } from "../../Components/Header/Header";
import UserStatisticsCSS from "./UserStatistics.module.css";
import { UserModule } from "../../Components/UserModule/UserModule";
import { AuthContext } from "../../Hooks/AuthContext";
import { UploadImageModal } from "../../Components/UploadImageModal/UploadImageModal";
import { ErrorModal } from "../../Components/ErrorModal/ErrorModal";
import { SuccessModal } from "../../Components/SuccessModal/SuccessModal";

export const UserStatistics = () => {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useContext(AuthContext);
  const username = user && user.username ? user.username : null;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const email = user && user.email ? user.email : null;
  const localDocument = user && user.hasDocument ? "true" : "false";
  const [hasDocument, setHasDocument] = useState(false);
  return (
    <>
      <ErrorModal
        message={error}
        show={error !== ""}
        onClose={() => {
          setError("");
        }}
      />
      <SuccessModal
        message={success}
        show={success !== ""}
        onClose={() => {
          setSuccess("");
        }}
      />

      <div className={UserStatisticsCSS["US-main-container"]}>
        <Header headingName="Personal Information" />
        <div className={UserStatisticsCSS["US-secondary-container"]}>
          <div className={UserStatisticsCSS["US-description-icon"]}>
            <i className={`${UserStatisticsCSS.profile} fa-solid fa fa-user`} />

            <div className={UserStatisticsCSS["US-description"]}>
              <p>Userame: {username}</p>
              <p>Email: {email}</p>
              {localDocument === "true" || hasDocument ? null : (
                <div className={UserStatisticsCSS["US-label-button"]}>
                  <label
                    htmlFor="pass"
                    className={UserStatisticsCSS["US-label"]}
                  >
                    Add a citizenship / license
                  </label>
                  <button
                    onClick={() => setOpenModal(true)}
                    className={UserStatisticsCSS["US-uploadButton"]}
                  >
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={UserStatisticsCSS["US-statistics"]}>
            <h1>User Activities</h1>
            <UserModule />
          </div>
        </div>
        <UploadImageModal
          show={openModal}
          handleClose={() => {
            setOpenModal(false);
          }}
          setOpenModal={setOpenModal}
          setHasDocument={setHasDocument}
          hasDocument={hasDocument}
          setError={setError}
          setSuccess={setSuccess}
        />
      </div>
    </>
  );
};
