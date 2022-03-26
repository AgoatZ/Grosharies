import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const Layout = (props) => {
    return (
        <div style={{ height: '100%' }}>
          <Header />
          <div>{props.children}</div> 
          {/* <Body /> */}
          <footer className="footer" style={{bottom: 0, width: '100%', position: "fixed"}}><Footer /></footer>
        </div>
      );
};

export default Layout;
