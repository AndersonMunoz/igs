import { Route, Routes } from "react-router-dom";
import { useState } from 'react'
import { Button,Table } from 'react-bootstrap';
import { Menu } from './components/Menu';
import Producto from './components/Producto'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Menu/>}>
        <Route path="/producto" element={<Producto />} />
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
        </Route>
      </Routes>
    </>
  )
}

export default App
