import React from "react";

const Producto = () => {
  return (
    <>
      <div className="container w-50">
        <form className="text-center border border-light p-5">
          <p className="h4 mb-4 bg-success p-2 text-white">Registrar Producto</p>
          <div className="d-flex gap-3 m-3">
            <label>Categoría</label>
            <select class="form-select form-select-sm" aria-label=".form-select-sm example">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
            <label>U.P</label>
            <select class="form-select form-select-sm" aria-label=".form-select-sm example">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div className="d-inline-flex gap-5">
            <div className="form-floating mb-3">
              <input type="date" className="form-control"/>
              <label htmlFor="floatingInput">Fecha de Caducidad</label>
            </div>
            <div className="form-floating">
              <input type="text" className="form-control" id="floatingPassword" placeholder="Password" />
              <label htmlFor="floatingPassword">Cantidad del Producto</label>
            </div>
          </div>
          <div className="d-inline-flex gap-5">
            <div className="form-floating mb-3">
              <input type="number" className="form-control" id="floatingInput" placeholder="name@example.com" />
              <label htmlFor="floatingInput">Precio del Producto</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
              <label htmlFor="floatingPassword">Password</label>
            </div>
          </div>
          <div className="d-inline-flex gap-5">
            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
              <label htmlFor="floatingPassword">Password</label>
            </div>
          </div>
            <div className="form-floating">
              <textarea className="form-control mb-4 h-20" placeholder="Leave a comment here" id="floatingTextarea2"></textarea>
              <label htmlFor="floatingTextarea">Descripción</label>
            </div>
          <button type="submit" className="btn btn-success btn-block" >Registrar</button>
        </form>
      </div>
    </>
  );
};

export default Producto;