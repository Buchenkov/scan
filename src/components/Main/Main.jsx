import React from 'react';
import '../styles/Main.css';
import About from "./About/About";
import WhyUs from "./WhyUs/WhyUs";
import Tariffs from "./Tariffs/Tariffs";

const Main = ({ isLoggedIn, userTariff }) => {
  return (
    <div className="main-content">
        <About isLoggedIn={isLoggedIn} />
        <WhyUs />
        <Tariffs isLoggedIn={isLoggedIn} userTariff={userTariff} />
    </div>
  )
}

export default Main