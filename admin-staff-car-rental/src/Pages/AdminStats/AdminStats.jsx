import React, { useContext } from "react";
import AdminStatsCSS from "./AdminStats.module.css";
import AdminNavbarmenu from "../../Layouts/AdminNavbar/AdminNavbarmenu";
import { AuthContext } from "../../Hooks/AuthProvider";
import { useNavigate } from "react-router-dom";

export const AdminStats = () => {
  const { user } = useContext(AuthContext);
  const username = user && user.username ? user.username : null;
  const email = user && user.email ? user.email : null;
  const navigate = useNavigate();

  return (
    <>
      <AdminNavbarmenu />
      <div className={AdminStatsCSS["AS-main-container"]}>
        <div className={AdminStatsCSS["AS-secondary-container"]}>
          <img
            className={AdminStatsCSS["AS-car"]}
            src={require("../../Assets/car.png")}
          />
          <div className={AdminStatsCSS["AS-information"]}>
            <p>
              <i className="fa fa-user" aria-hidden="true"></i> Username:{" "}
              {username}
            </p>
            <p>
              <i className="fa fa-envelope" aria-hidden="true"></i> Email:{" "}
              {email}
            </p>
            <div className={AdminStatsCSS["AS-buttons"]}>
              <button
                onClick={() => navigate("/ChangePassword")}
                className={AdminStatsCSS["AS-changePw"]}
              >
                Change Password
              </button>
              <button
                onClick={() => navigate("/admin-login")}
                className={AdminStatsCSS["AS-logout"]}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
