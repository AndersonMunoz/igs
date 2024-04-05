import React, { useEffect, useRef, useState } from "react";
import Erro404 from "../../img/404-page-not-found.1024x991.png";
import "../style/load.css"

const Error404 = () => {
  return (
    <div className="PaginaNoDisponible">
      <div className="PaginaNoDisponibleContend">
        <img src={Erro404} alt="Página no Disponible" className="img404" />
      </div>
    </div>
  );
};

export default Error404;
