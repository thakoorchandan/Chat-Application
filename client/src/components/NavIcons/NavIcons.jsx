import React from "react";

import Home from "../../img/home.png";
import Comment from "../../img/comment.png";
import { Link } from "react-router-dom";

const NavIcons = () => {
  const currentPath = window.location.pathname;
  return (
    <div className="navIcons">
      <Link to="../home">
        <div>
          <img src={Home} alt="" />
        </div>
      </Link>
      <Link to="../chat">
        <div>
          <img src={Comment} alt="" />
        </div>
      </Link>
    </div>
  );
};

export default NavIcons;
