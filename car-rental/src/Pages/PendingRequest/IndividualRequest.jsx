import React from 'react';
import PendingRequestCSS from "./PendingRequest.module.css";
import axios from 'axios';

export const IndivdualRequest = (props) => {
    const { setSuccess, setError, setIsLoading, pendingRequest, setPendingRequest } = props;
    const host = process.env.REACT_APP_API_HOST;
    const handleCancel = async (requestId) => {
        try {
            const response = await axios({
                method: "post",
                url: `${host}/api/Customer/cancel_request?id=${requestId}`,
                withCredentials: true,
            });

            if (response.status === 200) {
                setSuccess("Request cancelled successfully.")
                setPendingRequest(pendingRequest.filter((request) => request.id !== requestId));
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
    }
    return (
        <>
            <div className={PendingRequestCSS["PR-individual-container"]}>
                <div className={PendingRequestCSS["PR-image-detail"]}>
                    <img className={PendingRequestCSS["PR-image"]} src={props.image} alt="car" />
                    <div className={PendingRequestCSS["PR-details"]}>
                        <div className={PendingRequestCSS["PR-name-brand"]}>
                            <p className={PendingRequestCSS["PR-name"]}>{props.name}</p>
                            <p className={PendingRequestCSS["PR-brand"]}>({props.brand})</p>
                        </div>
                        <div className={PendingRequestCSS["PR-dates"]}>
                            <p>Start Date: {props.startDate}</p>
                            <p>End Date: {props.endDate}</p>
                        </div>
                        <p className={PendingRequestCSS["PR-cost"]}>Total Charge: <span>Rs {Math.round(props.totalPrice)}</span></p>
                    </div>
                </div>
                <button className={PendingRequestCSS["PR-button"]} onClick={() => handleCancel(props.requestId)}>Cancel Request</button>
            </div>
        </>
    )
}