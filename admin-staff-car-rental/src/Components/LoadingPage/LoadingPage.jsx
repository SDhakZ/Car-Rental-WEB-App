/* 
- Loading page when there is loading necessary
*/
import React from "react";
import LoadingCSS from "./loading.module.css";

export const LoadingPage = () => {
  return (
    <div className={LoadingCSS["center"]}>
      <div className={`${LoadingCSS["loader"]} ${LoadingCSS.rspin}`}>
        <span className={LoadingCSS["c"]}></span>
        <span className={`${LoadingCSS["d"]} ${LoadingCSS.spin}`}>
          <span className={LoadingCSS["e"]}></span>
        </span>
        <span className={`${LoadingCSS["r"]} ${LoadingCSS.r1}`}></span>
        <span className={`${LoadingCSS["r"]} ${LoadingCSS.r2}`}></span>
        <span className={`${LoadingCSS["r"]} ${LoadingCSS.r3}`}></span>
        <span className={`${LoadingCSS["r"]} ${LoadingCSS.r4}`}></span>
      </div>
    </div>
  );
};
