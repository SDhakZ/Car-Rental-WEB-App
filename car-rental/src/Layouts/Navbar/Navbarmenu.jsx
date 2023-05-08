/* 
- Navigation bar layout component
- Has responsive sttings which consists of toggle button
*/
import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import NavbarCSS from "./navbar.module.css";
import { AuthContext } from "../../Hooks/AuthContext";
import { NotificationBox } from "../../Components/Notification/NotificationBox";

const Navbarmenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenu, setisMenu] = useState(false);
  const [isResponsiveclose, setResponsiveclose] = useState(false);
  const toggleClass = () => {
    setisMenu(isMenu === false ? true : false);
    setResponsiveclose(isResponsiveclose === false ? true : false);
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const [isMenuSubMenu, setMenuSubMenu] = useState(false);

  const toggleSubmenu = () => {
    setMenuSubMenu(isMenuSubMenu === false ? true : false);
  };

  return (
    <header className={NavbarCSS["nav-header"]}>
      {isOpen && <NotificationBox />}
      <div className={NavbarCSS["nav-container"]}>
        <div className={NavbarCSS["nav-row"]}>
          <div className={NavbarCSS["nav-logo"]}>
            {/*   <img
              className={NavbarCSS["nav-logo-img"]}
              src={require("../../Assets/carLogo.png")}
              alt="car logo"
            /> */}
            <NavLink exact="true" to="/">
              <h1 className={NavbarCSS["logoName"]}>Hajur Ko Car Rental</h1>
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
                    setIsOpen(false);
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

                <li className={NavbarCSS["menu-item"]}>
                  <NavLink
                    onClick={() => {
                      setIsOpen(false);
                      toggleClass();
                      window.scrollTo({ top: 0 });
                    }}
                    to={`/viewCar`}
                  >
                    Cars to rent
                  </NavLink>
                </li>

                {/* profile */}
                {user ? (
                  <li
                    onClick={toggleSubmenu}
                    className={`${NavbarCSS["sub-menu-arrow"]} ${NavbarCSS["menu-item"]}`}
                  >
                    <NavLink
                      onClick={() => {
                        setIsOpen(false);
                        toggleClass();
                        window.scrollTo({ top: 0 });
                      }}
                      to={"/UserStatistics"}
                    >
                      <i
                        className={`${NavbarCSS.profile} fa-solid fa fa-user`}
                      />
                      &nbsp;{user.username} <FaChevronDown />
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
                          to={`/PendingRequest`}
                        >
                          <i
                            className={`${NavbarCSS["UM-icon"]} fa fa-envelope`}
                            aria-hidden="true"
                          />{" "}
                          Pending Requests
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={() => {
                            toggleClass();
                            window.scrollTo({ top: 0 });
                          }}
                          to={`/DamageReport`}
                        >
                          <i
                            className={`${NavbarCSS["UM-icon"]} fa fa-car-burst`}
                            aria-hidden="true"
                          />{" "}
                          Report Damage
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={() => {
                            toggleClass();
                            window.scrollTo({ top: 0 });
                          }}
                          to={`/ChangePassword`}
                        >
                          <i
                            className={`${NavbarCSS["UM-icon"]} fa fa-key`}
                            aria-hidden="true"
                          />
                          &nbsp;Change Password
                        </NavLink>
                      </li>

                      <li className={NavbarCSS["menu-item-signin"]}>
                        <NavLink
                          style={{ color: "red" }}
                          onClick={() => {
                            setIsOpen(false);
                            toggleClass();
                            window.scrollTo({ top: 0 });
                            if (user) {
                              logout();
                            }
                          }}
                          to={`/signin`}
                        >
                          <i
                            className={`${NavbarCSS["UM-icon"]} fa fa-sign-out`}
                            aria-hidden="true"
                          />
                          &nbsp;{user ? "Sign Out" : "Sign in"}
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li className={NavbarCSS["menu-item-signin"]}>
                    <NavLink
                      onClick={() => {
                        setIsOpen(false);
                        toggleClass();
                        window.scrollTo({ top: 0 });
                        if (user) {
                          logout();
                        }
                      }}
                      to={`/signin`}
                    >
                      &nbsp;{user ? "Sign Out" : "Sign in"}
                    </NavLink>
                  </li>
                )}

                {user ? (
                  <button
                    onClick={() => {
                      handleClick();
                    }}
                    className={NavbarCSS["menu-item-notification-button"]}
                  >
                    <img
                      className={NavbarCSS["menu-item-bell"]}
                      src={require("../../Assets/bell.png")}
                      alt="img not available"
                    />
                  </button>
                ) : null}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbarmenu;
