/* this error page is displayed if there are any errors in the pages */
import React from "react";
import ErrorPageCSS from "./ErrorPage.module.css";
import { Link } from "react-router-dom";

/* function to create structure of error page*/
export const ErrorPage = () => {
    return (
        <div className={ErrorPageCSS["errorPage"]}>
            <div className={ErrorPageCSS["ER-container"]}>
                <h1 className={ErrorPageCSS["ER-errorCode"]}>
                    error!
                </h1>
                <p className={ErrorPageCSS["ER-message"]}>
                    Please wait until the problem is resolved
                    <p className={ErrorPageCSS["ER-report"]}>
                        Try Refreshing the page
                    </p>
                </p>
                <div className={ErrorPageCSS["ER-buttons"]}>
                    {/* return to home page */}
                    <Link
                        to={{ pathname: "/" }}
                        className={ErrorPageCSS["ER-returnHomeButton"]}
                    >
                        Return Home
                    </Link>
                    {/* report problem in contact page */}
                    <button
                        onClick={() => window.location.reload()}
                        className={`${ErrorPageCSS["ER-refreshButton"]} ${ErrorPageCSS["ER-color-refreshButton"]}`}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        </div>
    );
};
