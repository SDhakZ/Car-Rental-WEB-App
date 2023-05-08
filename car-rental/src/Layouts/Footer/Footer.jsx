// Footer page to create the footer of the website.
import React from "react";
import FooterCSS from "./footer.module.css";

// Function to create the structure of footer page.
export const Footer = (props) => {
  return (
    // Start of footersection.
    <div className={FooterCSS.footer}>
      <div className={FooterCSS["footer-row"]}>
        {/* For columns of footer. */}
        <div className={FooterCSS["footer-companyDetail-container"]}>
          <div className={FooterCSS["footer-companyName-container"]}>
            <div className={FooterCSS["footer-companyName"]}>
              Hajur ko<span> Car </span> Rental
            </div>
          </div>
          <p>Rent affordable and luxurious cars</p>
        </div>

        <div
          className={`${FooterCSS["footer-column"]} ${FooterCSS["footer-pages"]}`}
        >
          <h4>Pages</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/ViewCar">Cars To Rent</a>
            </li>
            <li>
              <a href="/UserStatistics">User Statistics</a>
            </li>
          </ul>
        </div>

        <div className={FooterCSS["footer-column"]}>
          <h4>User Actions</h4>
          <ul>
            <li>
              <a href="/PendingRequest">Pending Requests</a>
            </li>
            <li>
              <a href="/DamageReport">Report Damage</a>
            </li>
            <li>
              <a href="/ChangePassword">Change Password</a>
            </li>
          </ul>
        </div>

        {/* Start of Link with us column. */}
        <div
          className={`${FooterCSS["footer-column"]} ${FooterCSS["footer-linkWithUs"]}`}
        >
          <h4>Link with us</h4>
          <div className={FooterCSS["footer-icons"]}>
            <a
              href="mailto: sharnam34@gmail.com"
              rel="noreferrer"
              target="_blank"
            >
              <i className={`${FooterCSS.envelope} fa-solid fa-envelope`}></i>
            </a>
            <a
              href="https://www.linkedin.com/"
              rel="noreferrer"
              target="_blank"
            >
              <i
                className={`${FooterCSS.instagram} fa-brands fa-instagram`}
              ></i>
            </a>
            <a
              href="https://www.facebook.com/"
              rel="noreferrer"
              target="_blank"
            >
              <i
                className={`${FooterCSS.facebook} fa-brands fa-facebook-f`}
              ></i>
            </a>
          </div>
        </div>

        {/*copyright*/}
      </div>
      <div className={FooterCSS["footer-copyright"]}>
        <span className={FooterCSS["footer-copyrightSymbol"]}>©</span>
        <p>
          2022, Hajur Ko Car Rental, rights reserved ||{" "}
          <a className={FooterCSS["footer-tc"]} href="/terms-and-conditions">
            Terms and conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
