import React, { useState } from "react";
import "../style/load.css"

const load = () => {
  return (
    <div className="loader">
      <div className="box-load1" />
      <div className="box-load2" />
      <div className="box-load3" />
    </div>
  );
};

export default load;
