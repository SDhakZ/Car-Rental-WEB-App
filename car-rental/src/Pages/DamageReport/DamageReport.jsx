import React, { useState, useEffect, useContext } from 'react';
import DamageReportCSS from "./DamageReport.module.css";
import { IndivdualReport } from './IndividualReport';
import { SuccessModal } from "../../Components/SuccessModal/SuccessModal";
import { ErrorModal } from "../../Components/ErrorModal/ErrorModal";
import { LoadingPage } from "../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";
import axios from "axios";
import { AuthContext } from '../../Hooks/AuthContext';
import { Header } from '../../Components/Header/Header';
import { EmptyDataInfo } from '../../Components/EmptyData/EmptyDataInfo';

export const DamageReport = () => {

    const host = process.env.REACT_APP_API_HOST;
    const [isLoading, setIsLoading] = useState(true);
    const [DamageReport, setDamageReport] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);
    const id = user && user.id ? user.id : null;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let url = `${host}/api/RentalHistory/get_rental_history?status=Paid&userId=${id}`;
                const response = await axios.get(url, { withCredentials: true });
                if (response.status === 200) {
                    setDamageReport(response.data.history);
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
    }, [setDamageReport, host, id]);

    return (
        <>
            <ErrorModal
                message={error}
                show={error !== ""}
                onClose={() => {
                    setError("");
                }}
            />
            <div className={DamageReportCSS["DR-main-container"]}>
                <Header headingName="Damage Report" />
                <div className={DamageReportCSS["DR-secondary-container"]}>
                    <SuccessModal
                        message={success}
                        show={success !== ""}
                        onClose={() => setSuccess("")}
                    />
                    {
                        isLoading === true ? (
                            <LoadingPage />
                        ) : error ? (
                            <ErrorPage />

                        ) : DamageReport.length === 0 ? (
                            <EmptyDataInfo message="No cars Rented" />
                        ) : (
                            DamageReport.map((request) => {
                                return (
                                    <IndivdualReport
                                        requestId={request.id}
                                        carId={request.car.id}
                                        name={request.car.name}
                                        brand={request.car.brand}
                                        startDate={request.startDate}
                                        endDate={request.endDate}
                                        totalPrice={request.totalCharge}
                                        image={request.car.image}
                                        setSuccess={setSuccess}
                                        setError={setError}
                                        setDamageReport={setDamageReport}
                                        DamageReport={DamageReport}
                                    />
                                );
                            })
                        )}
                </div>
            </div>
        </>
    )
}