import React from "react";
import EmptyDataInfoCSS from "./EmptyDataInfo.module.css";

export const EmptyDataInfo = () => {
  return (
    <div className={EmptyDataInfoCSS["ED-main-container"]}>
      <img
        className={EmptyDataInfoCSS["ED-img"]}
        src={require("../../Assets/no-data.png")}
        alt="no data"
      />
      <h2>No data found</h2>
      <a
        href="https://www.flaticon.com/free-icons/no-data"
        title="no data icons"
        className={EmptyDataInfoCSS["ED-attr"]}
      >
        No data icons created by Design Circle - Flaticon
      </a>
      <div className={EmptyDataInfoCSS["ED-btn-container"]}>
        <button
          onClick={() => window.location.reload()}
          className={EmptyDataInfoCSS["ED-btn"]}
        >
          <i
            className={`${EmptyDataInfoCSS.refresh} fa fa-refresh`}
            aria-hidden="true"
          ></i>{" "}
          Reload page
        </button>
      </div>
    </div>
  );
};
