import React from "react";
import UserModuleCSS from "./UserModule.module.css";

export const UserModule = () => {
  return (
    <div className={UserModuleCSS["UM-card-container"]}>
      <div className={UserModuleCSS["UM-card-group"]}>
        <div className={UserModuleCSS["UM-card"]}>
          <div className={UserModuleCSS["UM-card-content"]}>
            <h2 className={UserModuleCSS["UM-header"]}>
              <i
                className={`${UserModuleCSS["UM-icon"]} fa fa-times`}
                aria-hidden="true"
              ></i>{" "}
              Cancel Requests
            </h2>
            <p>Check and cancel any pending rent requests.</p>
            <a href="/PendingRequest">View Pending Requests</a>
          </div>
        </div>
        <div className={UserModuleCSS["UM-card"]}>
          <div className={UserModuleCSS["UM-card-content"]}>
            <h2 className={UserModuleCSS["UM-header"]}>
              <i
                className={`${UserModuleCSS["UM-icon"]} fa fa-car-burst`}
                aria-hidden="true"
              />
              Report Damages
            </h2>
            <p>Report any and all damages done to the rented cars.</p>
            <a href="/DamageReport">View Report Damage</a>
          </div>
        </div>
      </div>
      <div className={UserModuleCSS["UM-card-group"]}>
        <div className={UserModuleCSS["UM-card"]}>
          <div className={UserModuleCSS["UM-card-content"]}>
            <h2 className={UserModuleCSS["UM-header"]}>
              <i
                className={`${UserModuleCSS["UM-icon"]} fa fa-key`}
                aria-hidden="true"
              />
              Change Password
            </h2>
            <p>Change your password</p>
            <a href="/ChangePassword">Change Password</a>
          </div>
        </div>
      </div>
    </div>
  );
};
