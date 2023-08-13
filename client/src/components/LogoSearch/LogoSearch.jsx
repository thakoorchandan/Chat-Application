import React from "react";
import Logo from "../../img/logo.png";
import './LogoSearch.css'

const LogoSearch = () => {
  return (
    <div className="LogoSearch">
        <h3>Quick Chat</h3>
      <img src={Logo} alt="" />
    </div>
  );
};

export default LogoSearch;
