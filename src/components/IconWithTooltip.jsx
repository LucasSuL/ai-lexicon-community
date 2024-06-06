// src/IconWithTooltip.js
import React, { useState } from "react";
import "../IconWithTooltip.css";

const IconWithTooltip = ({icon}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const admin = icon == "circle-user"

  return (
    <div
      className="icon-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <i className={`fa-solid fa-${icon} text-success fs-6 ms-1`}></i>
      
      {showTooltip && admin && <div className="tooltip">This is an administrator.</div>}
      {showTooltip && !admin && <div className="tooltip">This is a verified user.</div>}
    </div>
  );
};

export default IconWithTooltip;
