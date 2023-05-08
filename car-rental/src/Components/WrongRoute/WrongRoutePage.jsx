import React from "react";
import { Header } from "../Header/Header";
import WrongRouteCSS from "./WrongRoutePage.module.css";
export const WrongRoutePage = () => {
    return (
        <>
            <div className={WrongRouteCSS["WR-main-container"]}>
                <Header headingName="Page not found" />
                <div className={WrongRouteCSS["WR-img-container"]}>
                    <img
                        className={WrongRouteCSS["WR-img"]}
                        src={require("../../Assets/carCrash.png")}
                        alt="car crash"
                    />
                    <a className={WrongRouteCSS["WR-home"]} href="/">
                        Go to home
                    </a>
                </div>
            </div>
        </>
    );
};