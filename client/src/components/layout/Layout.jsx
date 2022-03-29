import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./Layout.scss";

const Layout = (props) => {
  return (
      <div className="layout">
        <Header />
        <div>{props.children}</div>
        <Footer />
      </div>
    );
};

export default Layout;
