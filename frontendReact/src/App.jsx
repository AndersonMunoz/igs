import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Menu } from './components/Menu';
import Producto from './components/Producto';
import Movimiento from './components/Movimiento';
import Proveedor from './components/Proveedor';
import TipoProducto from './components/TipoProducto';
import Categoria from './components/Categoria';
import UnidadProductiva from './components/UnidadProductiva';
import Usuario from './components/Usuarios';
import Dashboard from './components/Dashboard';


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Menu/>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/producto" element={<Producto />} />
          <Route path="/movimiento" element={<Movimiento/>} />
          <Route path="/tipoproducto" element={<TipoProducto />} />
          <Route path="/categoria" element={<Categoria />} />
          <Route path="/up" element={<UnidadProductiva />} />
          <Route path="/proveedor" element={<Proveedor />} />
          <Route path="/usuario" element={<Usuario />} />
          
        </Route>
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