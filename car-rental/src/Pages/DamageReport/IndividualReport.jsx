import React, { useState } from 'react';
import DamageReportCSS from "./DamageReport.module.css";
import { DamageReportModal } from './DamageReportModal/DamageReportModal';

export const IndivdualReport = (props) => {
    const { setSuccess, carId, name, brand, requestId, image } = props;
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className={DamageReportCSS["DR-individual-container"]}>
                <div className={DamageReportCSS["DR-image-detail"]}>
                    <img className={DamageReportCSS["DR-image"]} src={props.image} alt="car" />
                    <div className={DamageReportCSS["DR-details"]}>
                        <div className={DamageReportCSS["DR-name-brand"]}>
                            <p className={DamageReportCSS["DR-name"]}>{props.name}</p>
                            <p className={DamageReportCSS["DR-brand"]}>({props.brand})</p>
                        </div>
                        <div className={DamageReportCSS["DR-dates"]}>
                            <p>Start Date: {props.startDate}</p>
                            <p>End Date: {props.endDate}</p>
                        </div>
                        <p className={DamageReportCSS["DR-cost"]}>Total Charge: <span>Rs {Math.round(props.totalPrice)}</span></p>
                    </div>
                </div>
                <button className={DamageReportCSS["DR-button"]} onClick={() => setOpenModal(true)}>Report Damage</button>
            </div>
            <DamageReportModal
                show={openModal}
                handleClose={() => {
                    setOpenModal(false);
                }}
                setSuccess={setSuccess}
                setOpenModal={setOpenModal}
                carId={carId}
                carName={name}
                carBrand={brand}
                rentalId={requestId}
                image={image}
            />
        </>
    )
}