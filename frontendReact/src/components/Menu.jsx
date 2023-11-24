import React, { useState } from 'react';
import {Outlet,Link} from 'react-router-dom';
import '../style/dashboard.css';
import { IconUser,IconMenu2,IconChevronDown  } from '@tabler/icons-react';

export const Menu = () =>{
  const [isSidebarClosed, setIsSidebarClosed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);

  const handleArrowClick = () => {
    setIsMenuShown((prev) => !prev);
  };
  const toggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
       <div className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
        <div className="logo-details">
        <img className="logo1" src="img/logoigs.jpeg" alt="" />
            <span className="logo_name">IGS</span>
        </div>
        <ul className="nav-links">
            <li>
                <a href="dashboard.html">
                    <i className="ti ti-home"></i>
                    <span className="link_name">Inicio</span>
                </a>
                <ul className="sub-menu blank">
                    <li><a className="link_name" href="#">Inicio</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="#">
                        <i className="ti ti-arrows-random"></i>
                        <span className="link_name">Movimientos</span>
                    </a>
                    <IconChevronDown className={`flecha ti arrow ${isMenuShown ? 'showMenu' : ''}`}
            onClick={handleArrowClick}/>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Movimientos</a></li>
                    <li><a href="#">Entadra</a></li>
                    <li><a href="#">Salida</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="#">
                        <i className="ti ti-building-store"></i>
                        <span className="link_name">Inventario</span>
                    </a>
                    <i className='flecha ti ti-chevron-down arrow'></i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Inventario</a></li>
                    <li><a href="#">Kardes</a></li>
                    <li><a href="#">Catalogo</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="#">
                        <i className="ti ti-apple"></i>
                        <span className="link_name">Productos</span>
                    </a>
                    <i className='flecha ti ti-chevron-down arrow'></i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Productos</a></li>
                    <li id="clickProduct"><a href="#">Nuevo Producto</a></li>
                    <li><a href="#">Mostar Productos</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="#">
                        <i className="ti ti-box-multiple"></i>
                        <span className="link_name">Categoria</span>
                    </a>
                    <i className='flecha ti ti-chevron-down arrow'></i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Categoria</a></li>
                    <li><a href="#">Nueva Categoria</a></li>
                    <li><a href="#">Mostar Categorias</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="#">
                        <i className="ti ti-truck-delivery"></i>
                        <span className="link_name">Proveedores</span>
                    </a>
                    <i className='flecha ti ti-chevron-down arrow'></i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Proveedores</a></li>
                    <li><a href="#">Nuevo Proveedor</a></li>
                    <li><a href="#">Mostar Proveedores</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="#">
                        <i className="ti ti-clipboard-text"></i>
                        <span className="link_name">Reportes</span>
                    </a>
                    <i className='flecha ti ti-chevron-down arrow'></i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Reportes</a></li>
                    <li><a href="#">Historial</a></li>
                    <li><a href="#">Productos a Caducar</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="formularioSanti.html">
                        <i className="ti ti-user"></i>
                        <span className="link_name">Usuarios</span>
                    </a>
                    <i className='flecha ti ti-chevron-down arrow'></i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Usuarios</a></li>
                    <li><a href="#">Nuevo Usuario</a></li>
                    <li><a href="#">Mostar Usuarios</a></li>
                </ul>
            </li>
            <li>
                <div className="content-nav">
                    <a href="#">
                        <i className="ti ti-help-circle"></i>
                        <span className="link_name">Ajustes</span>
                    </a>
                    <i className='flecha ti ti-chevron-down arrow'></i>
                </div>
                <ul className="sub-menu">
                    <li><a className="link_name" href="#">Ajustes</a></li>
                    <li><a href="#">Perfil</a></li>
                    <li><a href="#">Ayuda</a></li>
                    <li><a href="#">Manual de Usuario</a></li>
                    <li><a href="#">Comentarios</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <div className="home-section">
      <div className="box-menu-hader" onClick={toggleSidebar}>
          <IconMenu2 className={`ti-menu-2 ${isSidebarClosed ? 'close' : ''}`} />
        </div>
        <div className="sena">
            <svg className="logoSena" xmlns="http://www.w3.org/2000/svg" id="a" viewBox="0 0 63.67 62.2">
                <defs>
                </defs>
                <path className="b" d="M32,0c3.77,0,6.85,3.1,6.85,6.9s-3.07,6.9-6.85,6.9-6.85-3.1-6.85-6.9S28.23,0,32,0" />
                <path className="b"
                    d="M7.06,22.26v.03c-.02,.12-.03,.2-.03,.25,0,.36,.2,.62,.6,.8,.41,.17,1.03,.26,1.88,.26,.65,0,1.15-.07,1.52-.21,.37-.14,.55-.34,.55-.59,0-.38-.73-.68-2.17-.92-.17-.03-.3-.05-.38-.06-.09-.02-.23-.04-.41-.07-2.3-.38-3.78-.79-4.44-1.23-.32-.22-.56-.47-.73-.76-.16-.29-.24-.62-.24-.99,0-.9,.53-1.59,1.59-2.06,1.06-.47,2.61-.71,4.64-.71s3.5,.22,4.47,.66c.97,.44,1.45,1.12,1.45,2.04v.11h-3.81v-.04c0-.32-.19-.55-.58-.72-.39-.16-.95-.25-1.7-.25-.58,0-1.03,.06-1.33,.17-.32,.12-.47,.28-.47,.49,0,.38,.83,.71,2.49,.97,.32,.05,.57,.09,.75,.12,1.18,.2,2.03,.37,2.53,.51,.5,.14,.93,.31,1.3,.5,.4,.22,.72,.5,.94,.84,.22,.34,.33,.71,.33,1.12,0,.93-.58,1.64-1.73,2.15-1.15,.5-2.81,.75-4.97,.75s-3.69-.24-4.64-.72c-.96-.48-1.43-1.25-1.43-2.32v-.14H7.06Zm10.44,3.02v-9.14h10.87v1.97h-6.79v1.46h6.27v1.95h-6.27v1.77h7.04v2h-11.12Zm12.83,0v-9.14h5.16l5.53,6.14v-6.14h3.92v9.14h-5.36l-5.35-6.16v6.16h-3.91Zm25.15-3.65l-1.95-3.32-2.06,3.32h4.02Zm-6.22,3.65h-4.09l6.32-9.14h4.53l6.03,9.14h-4.54l-.92-1.65h-6.33l-.98,1.65Z" />
                <path className="b"
                    d="M12.08,57.52l-3.65-3.43,11.1-19.29c.6-1.05-.15-2.37-1.36-2.37H0v-4.83H29.24L12.08,57.52Z" />
                <path className="b"
                    d="M51.6,57.52l3.65-3.43-11.1-19.29c-.6-1.05,.15-2.37,1.36-2.37h18.17v-4.83h-29.24l17.16,29.92Z" />
                <path className="b"
                    d="M31.8,32.7s.04-.07,.04-.07l16.48,27.28-4.38,2.28-10.62-17.81c-.63-1.05-2.14-1.05-2.76,0-3.54,5.98-10.55,17.81-10.55,17.81l-4.28-2.12s15.19-25.87,16.07-27.37" />
            </svg>
        </div>
        <div id="userAlert" className="usuario" onClick={toggleModal}>
            <IconUser className='user1'/>
            <p>Administrador</p>
        </div>
    </div>
    <div className={`modalClose ${isModalOpen ? 'modalUser' : ''}`}>
        <div className="userSpace">
            <i id="closeX" className="closeUser ti ti-x"></i>
            <a className="letraUser ax"><i className="iconModal ti ti-settings"></i>Ajustes</a>
            <a href="../frontend/index.html" className="letraUser az"><i className="iconModal ti ti-user-x"></i>Cerrar sesión</a>
        </div>
    </div>

    <div className="contenido">
        <div className="containerProductos">
            
        </div>
    </div>
    </>
  )
}