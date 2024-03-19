import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "./components/Menu";
import Producto from "./components/Producto";
import MovimientoEntrada from "./components/MovimientoEntrada";
import MovimientoSalida from "./components/MovimientoSalida";
import Movimiento from "./components/Movimiento";
import Proveedor from "./components/Proveedor";
import TipoProducto from "./components/TipoProducto";
import Categoria from "./components/Categoria";
import UnidadProductiva from "./components/UnidadProductiva";
import Usuario from "./components/Usuarios";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/Inventario";
import ProductoCaducar from "./components/ProductoCaducar";
import PefilAjustes from "./components/PerfilAjustes";
import ReportePorFechas from "./components/ReportePorFechas.jsx";
import Kardex from "./components/Kardex.jsx";
import Ayuda from "./components/Ayuda.jsx";
import Instructores from "./components/Instructores.jsx";
import Titulados from "./components/Titulados.jsx";


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/producto" element={<Producto />} />
          <Route path="/movimiento" element={<Movimiento />} />
          <Route path="/movimiento/entrada" element={<MovimientoEntrada />} />
          <Route path="/movimiento/salida" element={<MovimientoSalida />} />
          <Route path="/tipoproducto" element={<TipoProducto />} />
          <Route path="/categoria" element={<Categoria />} />
          <Route path="/up" element={<UnidadProductiva />} />
          <Route path="/proveedor" element={<Proveedor />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/usuario/instructores" element={<Instructores />} />
          <Route path="/usuario/titulados" element={<Titulados />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/producto/caducar" element={<ProductoCaducar />} />
          <Route path="/ajustes" element={<PefilAjustes />} />
          <Route path="/reporte-fechas" element={<ReportePorFechas />} />
          <Route path="/kardex" element={<Kardex />} />
          <Route path="/ajustes/ayuda" element={<Ayuda/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
