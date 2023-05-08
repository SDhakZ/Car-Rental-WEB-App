import React, { useState, useEffect, useContext } from 'react';
import PendingRequestCSS from "./PendingRequest.module.css";
import { IndivdualRequest } from './IndividualRequest';
import { SuccessModal } from "../../Components/SuccessModal/SuccessModal";
import { LoadingPage } from "../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";
import axios from "axios";
import { Header } from '../../Components/Header/Header';
import { AuthContext } from '../../Hooks/AuthContext';
import { EmptyDataInfo } from '../../Components/EmptyData/EmptyDataInfo';

export const PendingRequest = () => {

  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const id = user && user.id ? user.id : null;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${host}/api/RentalHistory/get_rental_history?status=Pending-Approved&userId=${id}`;
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          setPendingRequest(response.data.history);
        }
      } catch (error) {
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
  }, [setPendingRequest, host, id]);

  return (
    <>
      <div className={PendingRequestCSS["PR-main-container"]}>
        <Header headingName="Pending Requests" />
        <div className={PendingRequestCSS["PR-secondary-container"]}>
          <SuccessModal
            message={success}
            show={success !== ""}
            onClose={() => setSuccess("")}
          />
          {isLoading === true ? (
            <LoadingPage />
          ) : error ? (
            <ErrorPage />
          ) : pendingRequest.length === 0 ? (
            <EmptyDataInfo message="No Pending Request" />
          ) : (
            pendingRequest.map((request) => {
              return (
                <IndivdualRequest
                  requestId={request.id}
                  name={request.car.name}
                  brand={request.car.brand}
                  startDate={request.startDate}
                  endDate={request.endDate}
                  totalPrice={request.totalCharge}
                  image={request.car.image}
                  setSuccess={setSuccess}
                  setError={setError}
                  setIsLoading={setIsLoading}
                  setPendingRequest={setPendingRequest}
                  pendingRequest={pendingRequest}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  )
}