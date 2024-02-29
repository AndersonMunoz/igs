// import App from "../App";
// import Inicio from "../Login/Inicio";

// if (localStorage.getItem("token")) {
//   function parseJwt(token) {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       window
//         .atob(base64)
//         .split("")
//         .map(function (c) {
//           return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//         })
//         .join("")
//     );
  
//     return JSON.parse(jsonPayload);
//   }
  
//   var tokenExistAndStillVAlid = (parseJwt(localStorage.getItem("token")).exp*1000 > Date.now());
// }
// /* var tokenExistAndStillVAlid = true */
// const Main = () => {
//   return <>{tokenExistAndStillVAlid ? <App /> : <Inicio />}</>;
// };
// export default Main;
import React from "react";
import { useNavigate } from "react-router-dom";
import App from "../App";
import Inicio from "../Login/Inicio";

const Main = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const tokenExistAndStillValid = token && (parseJwt(token).exp * 1000 > Date.now());

  return <>{tokenExistAndStillValid ? <App /> : <Inicio />}</>;
};

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default Main;

