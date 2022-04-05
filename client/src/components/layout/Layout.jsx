import React, { useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./Layout.scss";
import PhoneLayout from "./PhoneLayout";

const Layout = (props) => {

  const [isPhoneSize, setIsPhoneSize] = useState(false);
  
  function handler(){ 
    setIsPhoneSize(!isPhoneSize);
  }
  
  window.matchMedia("(max-width: 1000px)").addEventListener('change', handler);

  const phoneLayout = (
    <PhoneLayout>
      <div>{props.children}</div>
    </PhoneLayout>
  );

  const layout = (
    <>
      <Header />
        <div>{props.children}</div>
      <Footer />
    </>
  );

  return (
    <div className="layout">
      {(isPhoneSize) ? phoneLayout : layout}
    </div>
  );
};

export default Layout;
