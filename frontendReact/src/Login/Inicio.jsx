import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Sweet from "../helpers/Sweet";
import Inicio from "../Login/Inicio";
import './css/login.css';


const LoginForm = () => {
  const [documento, setDocumento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loginSuccesFull, setLoginSuccesFull] = useState(false);


  const handledocumentoChange = (e) => {
    setdocumento(e.target.value);
  };

  const handlecontrasenaChange = (e) => {
    setcontrasena(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/aut/validar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documento,
        contrasena,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          console.log(data.token);
          setLoginSuccesFull(true)
          localStorage.setItem("token", data.token);
          window.location.reload()
        } else {
          Sweet.error(data.message);
          setLoginSuccesFull(false)
        }
      });
    console.log("documento:", documento);
    console.log("Contraseña:", contrasena);
  };

  return (
    <>
      {loginSuccesFull ? <Inicio /> :
        <>
        <Container className="login-container">
        <form onSubmit={handleSubmit}>
      <label htmlFor="email">documento:</label>
      <input
        type="text"
        id="text"
        value={documento}
        onChange={(event) => setDocumento(event.target.value)}
      />
      <label htmlFor="password">Contaseña:</label>
      <input
        type="password"
        id="password"
        value={contrasena}
        onChange={(event) => setContrasena(event.target.value)}
      />
       
      <button type="submit">Log in</button>
      <div className="mt-3">
        <a href="#">Olvide mi Contraseña</a>
       </div>
    </form>
        </Container>
        </>
      }
    </>

  );
};

export default LoginForm;
