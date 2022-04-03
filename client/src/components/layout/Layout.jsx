import React, { useState } from "react";
import { useEffect } from 'react';
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./Layout.scss";
import PhoneLayout from "./PhoneLayout";

const Layout = (props) => {
  const [screenSize, setScreenSize] = useState(window.screenX);
  useEffect(() => {
    const handler = () => { console.log('-----------------------'); setScreenSize(window.screenX); }
    window.matchMedia("(max-width: 1000px)").addEventListener('change', handler);
  }, []);

  return (
    <div className="layout">
      {(screenSize > 1000)} ? (
      <Header />
      <div>{props.children}</div>
      <Footer />
    ):
      <PhoneLayout>
        <div>{props.children}</div>
      </PhoneLayout>
    </div>
    );
};

export default Layout;
