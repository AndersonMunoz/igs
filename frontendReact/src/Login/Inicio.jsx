import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Sweet from "../helpers/Sweet";
import Inicio from "../Login/Inicio";
import './css/login.css';


const LoginForm = () => {
  const [documento, setdocumento] = useState("");
  const [contrasena, setcontrasena] = useState("");
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
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group controlId="formdocumento">
              <Form.Label>Documento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su documento"
                value={documento}
                onChange={handledocumentoChange}
              />
            </Form.Group>

            <Form.Group controlId="formcontrasena">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={contrasena}
                onChange={handlecontrasenaChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Iniciar Sesión
            </Button>
          </Form>
        </Container>
        </>
      }
    </>

  );
};

export default LoginForm;
