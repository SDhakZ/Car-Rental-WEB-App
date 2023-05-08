/* 
- Navigation bar layout component
- Has responsive sttings which consists of toggle button
*/
import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import NavbarCSS from "./adminNavbar.module.css";
import { AuthContext } from "../../Hooks/AuthProvider";

const AdminNavbarmenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenu, setisMenu] = useState(false);
  const [isResponsiveclose, setResponsiveclose] = useState(false);
  const toggleClass = () => {
    setisMenu(isMenu === false ? true : false);
    setResponsiveclose(isResponsiveclose === false ? true : false);
  };
  const username = user && user.username ? user.username : null;
  const role = user && user.role ? user.role : null;
  const [isMenuSubMenu, setMenuSubMenu] = useState(false);
  const toggleSubmenu = () => {
    setMenuSubMenu(isMenuSubMenu === false ? true : false);
  };

  return (
    <header className={NavbarCSS["nav-header"]}>
      <div className={NavbarCSS["nav-container"]}>
        <div className={NavbarCSS["nav-row"]}>
          {/* Add Logo  */}
          <div className={NavbarCSS["nav-logo"]}>
            <NavLink exact="true" to="/">
              <h1 className={NavbarCSS["logoName"]}>
                {username} [{role}]
              </h1>
            </NavLink>
          </div>

          <div className={NavbarCSS["nav-menus"]}>
            <nav className={NavbarCSS["main-nav"]}>
              {/* Responsive Menu Button */}
              {isResponsiveclose === true ? (
                <span
                  className={NavbarCSS["nav-icon"]}
                  style={{ display: "none" }}
                  onClick={() => {
                    toggleClass();
                    window.scrollTo({ top: 0 });
                  }}
                >
                  <span className={NavbarCSS["cross"]}>
                    <ImCross />
                  </span>
                </span>
              ) : (
                <span
                  className={NavbarCSS["nav-icon"]}
                  style={{ display: "none" }}
                  onClick={toggleClass}
                >
                  <span className={NavbarCSS["bars"]}>
                    <FaBars />
                  </span>
                </span>
              )}

              <ul
                className={
                  isMenu
                    ? `${NavbarCSS["main-menu"]} ${NavbarCSS["menu-right"]} ${NavbarCSS["menu-container"]}`
                    : `${NavbarCSS["main-menu"]} ${NavbarCSS["menu-right"]}`
                }
              >
                <li className={NavbarCSS["menu-item"]}>
                  <NavLink exact="true" onClick={toggleClass} to={`/`}>
                    Home
                  </NavLink>
                </li>
                {role === "Admin" ? (
                  <li className={NavbarCSS["menu-item"]}>
                    <NavLink
                      exact="true"
                      onClick={toggleClass}
                      to={`/AllUsers`}
                    >
                      All Users
                    </NavLink>
                  </li>
                ) : null}

                <li
                  onClick={toggleSubmenu}
                  className={`${NavbarCSS["sub-menu-arrow"]} ${NavbarCSS["menu-item"]}`}
                >
                  <NavLink onClick={toggleClass} to={"/Managements"}>
                    Managements <FaChevronDown />
                  </NavLink>

                  <ul
                    className={
                      isMenuSubMenu
                        ? `${NavbarCSS["sub-menus-container"]} ${NavbarCSS["sub-menus-active"]}`
                        : `${NavbarCSS["sub-menus-container"]}`
                    }
                  >
                    {role === "Admin" ? (
                      <li>
                        <NavLink
                          onClick={() => {
                            toggleClass();
                            window.scrollTo({ top: 0 });
                          }}
                          to={`/UserManagement`}
                        >
                          <i className="fa fa-user" aria-hidden="true"></i> User
                          Management
                        </NavLink>
                      </li>
                    ) : null}

                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/OfferManagement`}
                      >
                        <i className="fa fa-percent" aria-hidden="true"></i>{" "}
                        Offer Management
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/CarManagement`}
                      >
                        <i className="fas fa-car" aria-hidden="true"></i> Car
                        Management
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/RentalManagement`}
                      >
                        <i className="fa fa-handshake-o" aria-hidden="true"></i>{" "}
                        Rental Management
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li
                  onClick={toggleSubmenu}
                  className={`${NavbarCSS["sub-menu-arrow"]} ${NavbarCSS["menu-item"]}`}
                >
                  <NavLink onClick={toggleClass} to={"/Payments"}>
                    Payments <FaChevronDown />
                  </NavLink>

                  <ul
                    className={
                      isMenuSubMenu
                        ? `${NavbarCSS["sub-menus-container"]} ${NavbarCSS["sub-menus-active"]}`
                        : `${NavbarCSS["sub-menus-container"]}`
                    }
                  >
                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/PaymentApproval`}
                      >
                        <i className={`fa fa-money`} aria-hidden="true"></i>{" "}
                        <i className="fa fa-check" aria-hidden="true"></i>{" "}
                        Payment Approval
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/DamageRequest`}
                      >
                        <i
                          className={`fas fa-car-crash`}
                          aria-hidden="true"
                        ></i>{" "}
                        <i
                          className="fa-solid fa-message"
                          aria-hidden="true"
                        ></i>{" "}
                        Damage Requests
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/DamagePaymentLogs`}
                      >
                        <i
                          className={`fas fa-car-crash`}
                          aria-hidden="true"
                        ></i>{" "}
                        <i className={`fa fa-history`} aria-hidden="true"></i>{" "}
                        Damage Payment Logs
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/ReturnCar`}
                      >
                        <i className={`fas fa-car`} aria-hidden="true"></i>{" "}
                        Return Car
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li
                  onClick={toggleSubmenu}
                  className={`${NavbarCSS["sub-menu-arrow"]} ${NavbarCSS["menu-item"]}`}
                >
                  <NavLink onClick={toggleClass} to={"/RentalStats"}>
                    Rental Statistics <FaChevronDown />
                  </NavLink>

                  <ul
                    className={
                      isMenuSubMenu
                        ? `${NavbarCSS["sub-menus-container"]} ${NavbarCSS["sub-menus-active"]}`
                        : `${NavbarCSS["sub-menus-container"]}`
                    }
                  >
                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/UserStats`}
                      >
                        <i className="fa fa-user" aria-hidden="true"></i>{" "}
                        <i className="fa fa-table" aria-hidden="true"></i> User
                        Statistics
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/CarStats`}
                      >
                        <i className="fa fa-car" aria-hidden="true"></i>{" "}
                        <i className="fa fa-bar-chart" aria-hidden="true"></i>{" "}
                        Car Rent Statistics
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/RentalHistory`}
                      >
                        <i className="fa fa-history" aria-hidden="true"></i>{" "}
                        Rental History
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/CarSales`}
                      >
                        <i className="fa fa-money" aria-hidden="true"></i> Car
                        Sales
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li
                  onClick={toggleSubmenu}
                  className={`${NavbarCSS["sub-menu-arrow"]} ${NavbarCSS["menu-item"]}`}
                >
                  <NavLink onClick={toggleClass} to={"/AdminStats"}>
                    {username} <FaChevronDown />
                  </NavLink>

                  <ul
                    className={
                      isMenuSubMenu
                        ? `${NavbarCSS["sub-menus-container"]} ${NavbarCSS["sub-menus-active"]}`
                        : `${NavbarCSS["sub-menus-container"]}`
                    }
                  >
                    <li>
                      <NavLink
                        style={{ color: "blue" }}
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                        }}
                        to={`/ChangePassword`}
                      >
                        <i className="fa fa-key" aria-hidden="true"></i> Change
                        Password
                      </NavLink>
                    </li>
                    <li className={NavbarCSS["menu-item-signin"]}>
                      <NavLink
                        style={{ color: "red" }}
                        onClick={() => {
                          toggleClass();
                          window.scrollTo({ top: 0 });
                          if (user) {
                            logout();
                          }
                        }}
                        to={`/admin-login`}
                      >
                        <i className="fa fa-sign-out" aria-hidden="true"></i>{" "}
                        Log out
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbarmenu;
