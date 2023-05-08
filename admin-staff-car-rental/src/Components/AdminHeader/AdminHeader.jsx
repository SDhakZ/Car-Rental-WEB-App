/* 
- Main page heading component.
- Takes headingName prop to set the heading as the page requires.
*/
import React from "react";
import AdminHeadingCSS from "./AdminHeading.module.css";
import { useSpring, animated, easings } from "react-spring";
export default function AdminHeader(props) {
  const style = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
    config: { duration: 800, easing: easings.easeOutBack },
  });
  return (
    <animated.div style={style}>
      <h1 className={AdminHeadingCSS["page-heading"]}>{props.headingName}</h1>
    </animated.div>
  );
}
