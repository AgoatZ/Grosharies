import React from "react";
import SideMenu from "../side-menu/SideMenu";
import "./PhoneLayout.scss";

const PhoneLayout = (props) => {
  return (
      <div className="phoneLayout">
        <SideMenu />
        <div>{props.children}</div>
      </div>
    );
};

export default PhoneLayout;