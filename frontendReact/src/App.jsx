import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Menu } from './components/Menu';
import Producto from './components/Producto';

const App = () => {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Producto />} />
        <Route path="/producto" element={<Producto />} />
      </Routes>
    </>
  );
};

export default App;

          {/* <Route path="/" element={<Dashboard/>}/>
          <Route path="/movimiento" element={<Movimiento/>}>
            <Route path="/entrada" element={<Entrada/>}/>
            <Route path="/salida" element={<Salida/>}/>
          </Route>
          <Route path="/inventario" element={<Inventario/>}>
            <Route path="/kardex" element={<Kardex/>}/>
            <Route path="/catalogo" element={<Catalogo/>}/>
          </Route>
          <Route path="/categoria" element={<Categoria/>}/>
          <Route path="/proveedores" element={<Proveedores/>}/> */}