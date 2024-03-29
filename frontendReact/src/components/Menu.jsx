import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../style/dashboard.css";
import IgsLogo from "../../img/IGS.png";
import { dataDecript } from "./encryp/decryp";
import {
  IconUser,
  IconMenu2,
  IconChevronDown,
  IconApple,
  IconArrowsRandom,
  IconBuildingStore,
  IconHome,
  IconBoxMultiple,
  IconTruckDelivery,
  IconClipboardText,
  IconHelpSquareRounded,
  IconX,
  IconSettings,
  IconUserOff,
  IconBuildingWarehouse,
  IconBrandProducthunt,
  IconBell
} from "@tabler/icons-react";
import portConexion from "../const/portConexion";


export const Menu = () => {
  const [userName, setUserName] = useState("");
  const [userRoll, setUserRoll] = useState("");
  const [id, setId] = useState(dataDecript(localStorage.getItem("id")));
  const [alert, setAlert] = useState(0); // Inicializar alert con 0
  const [elementoAlmacenado, setElemento] = useState([]); // Inicializar elementoAlmacenado con un array vacío
  const [stockMin, setStockMin] = useState('');


  useEffect(() => {

    let arrow = document.querySelectorAll(".container-icon");
    for (let i = 0; i < arrow.length; i++) {
      arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
      });
    }

    setUserName(dataDecript(localStorage.getItem("name")));
    setUserRoll(dataDecript(localStorage.getItem("roll")));

    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".ti-menu-2");

    sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
    /* modal cerrar secion */

    let modalUser = document.getElementById("userAlert");
    let modal = document.querySelector(".modalClose");
    let closeX = document.getElementById("closeX");

    modalUser.addEventListener("click", () => {
      modal.classList.toggle("modalUser");
      modal.classList.toggle("modalClose");

      modalX.classList.remove("modalNotificaciones");
      modalX.classList.add("modalCloseNoti");

    });

    closeX.addEventListener("click", () => {
      modal.classList.remove("modalUser");
      modal.classList.add("modalClose");
    });


    /* modal notificaciones */
    let modalNoti = document.getElementById("notiAlerta");
    let modalX = document.querySelector(".modalCloseNoti");
    let closeNoti = document.getElementById("closeNoti");

    modalNoti.addEventListener("click", () => {
      modalX.classList.toggle("modalNotificaciones");
      modalX.classList.toggle("modalCloseNoti");

      modal.classList.remove("modalUser");
      modal.classList.add("modalClose");
    });

    closeNoti.addEventListener("click", () => {
      modalX.classList.add("modalCloseNoti");
      modalX.classList.remove("modalNotificaciones");
    });



    listartMen(id);

  }, []);






  function listartMen(id_usuario) {
    fetch(`http://${portConexion}:3000/usuario/buscar/${id_usuario}`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStockMin(data[0].stock_minimo)
        calcularMIn((data[0].stock_minimo))
      })
  }

  function calcularMIn(stockMin) {
    fetch(`http://${portConexion}:3000/producto/listar`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.status === 204) {
          return null;
        }
        return res.json();
      })
      .then((data) => {
        let cont = 0;
        let menores = [];
        if (data !== null) {
          for (let index = 0; index < data.length; index++) {
            if (stockMin > data[index].Cantidad) {
              cont = cont + 1;
              menores.push(data[index]);
            }
          }
          setAlert(cont);
          setElemento(menores);
        }
      });
  }

  return (
    <>
      <div className="main-container">
        <div className="sidebar close">
          <div className="logo-details">
            <img src={IgsLogo} className="logo1" />
            <div className="fondoImg">
              <span className="logo_name">IGS</span>
            </div>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">
                <div className="tamañoLateral">
                  <IconHome className="iconosLaterales" />
                </div>
                <span className="link_name">Inicio</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link to="/" className="link_name">
                    Inicio
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <div className="content-nav">
                <Link to="/movimiento">
                  <div className="tamañoLateral">
                    <IconArrowsRandom className="iconosLaterales" />
                  </div>
                  <span className="link_name">Movimientos</span>
                </Link>
                <div className="container-icon">
                  <IconChevronDown className="iconoA" />
                </div>
              </div>
              <ul className="sub-menu">
                <li>
                  <Link className="link_name" to="/movimiento">
                    Movimiento
                  </Link>
                </li>
                <li>
                  <Link to="/movimiento/entrada">Entrada</Link>
                </li>
                <li>
                  <Link to="/movimiento/salida">Salida</Link>
                </li>
              </ul>
            </li>

            <li>
              <div className="content-nav">
                <Link to="/inventario">
                  <div className="tamañoLateral">
                    <IconBuildingStore className="iconosLaterales" />
                  </div>
                  <span className="link_name">Inventario</span>
                </Link>
                <div className="container-icon">
                  <IconChevronDown className="iconoA" />
                </div>
              </div>
              <ul className="sub-menu">
                <li>
                  <Link className="link_name" to="/inventario">
                    Inventario
                  </Link>
                </li>
                <li>
                  <Link to="/kardex">Kardex</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/producto">
                <div className="tamañoLateral">
                  <IconBrandProducthunt className="iconosLaterales" />
                </div>
                <span className="link_name">Productos</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link className="link_name" to="/producto">
                    Productos
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/tipoproducto">
                <div className="tamañoLateral">
                  <IconApple className="iconosLaterales" />
                </div>
                <span className="link_name">Tipo Producto</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link className="link_name" to="/up">
                    Tipo Producto
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/categoria">
                <div className="tamañoLateral">
                  <IconBoxMultiple className="iconosLaterales" />
                </div>
                <span className="link_name">Categoria</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link className="link_name" to="/categoria">
                    Categoria
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/up">
                <div className="tamañoLateral">
                  <IconBuildingWarehouse className="iconosLaterales" />
                </div>
                <span className="link_name">Bodega</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link className="link_name" to="/up">
                    Bodega
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/proveedor">
                <div className="tamañoLateral">
                  <IconTruckDelivery className="iconosLaterales" />
                </div>
                <span className="link_name">Proveedores</span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <Link className="link_name" to="/proveedor">
                    Proveedores
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <div className="content-nav">
                <Link to="#">
                  <div className="tamañoLateral">
                    <IconClipboardText className="iconosLaterales" />
                  </div>
                  <span className="link_name">Reportes</span>
                </Link>
                <div className="container-icon">
                  <IconChevronDown className="iconoA" />
                </div>
              </div>
              <ul className="sub-menu">
                <li>
                  <Link className="link_name" to="/reporte-fechas">
                    Reportes
                  </Link>
                </li>
                <li>
                  <Link to="/producto/caducar">Productos a Caducar</Link>
                </li>
              </ul>

            </li>
            {userRoll === "administrador" ? (
              <>
                <li>
                  <div className="content-nav">
                    <Link to="/usuario">
                      <div className="tamañoLateral">
                        <IconUser className="iconosLaterales" />
                      </div>
                      <span className="link_name">Usuarios</span>
                    </Link>
                    <div className="container-icon">
                      <IconChevronDown className="iconoA" />
                    </div>
                  </div>

                  <ul className="sub-menu">
                    <li>
                      <Link className="link_name" to="/usuario">
                        Usuarios
                      </Link>
                    </li>
                    <li>
                      <Link to="/usuario/instructores">Instructores</Link>
                    </li>
                    <li>
                      <Link to="/usuario/titulados">Titulados</Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="d-none">
                  <div className="content-nav">
                    <Link to="/usuario">
                      <div className="tamañoLateral">
                        <IconUser className="iconosLaterales" />
                      </div>
                      <span className="link_name">Usuarios</span>
                    </Link>
                    <div className="container-icon">
                      <IconChevronDown className="iconoA" />
                    </div>
                  </div>

                  <ul className="sub-menu">
                    <li>
                      <Link className="link_name" to="/usuario">
                        Usuarios
                      </Link>
                    </li>
                    <li>
                      <Link to="/usuario/instructores">Instructores</Link>
                    </li>
                    <li>
                      <Link to="/usuario/titulados">Titulados</Link>
                    </li>
                  </ul>
                </li>

              </>
            )}
            <li>
              <div className="content-nav">
                <Link>
                  <div className="tamañoLateral">
                    <IconSettings className="iconosLaterales" />
                  </div>
                  <span className="link_name">Ajustes</span>
                </Link>
                <div className="container-icon">
                  <IconChevronDown className="iconoA" />
                </div>
              </div>
              <ul className="sub-menu">
                <li>
                  <Link className="link_name">
                    Ajustes
                  </Link>
                </li>
                <li>
                  <Link to="/ajustes">Perfil</Link>
                </li>
                <li>
                  <Link to="/ajustes/ayuda">Ayuda</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="home-section">
          <div className="box-menu-hader">
            <IconMenu2 className="ti-menu-2" />
          </div>
          <div className="sena">
            <svg
              className="logoSena"
              xmlns="http://www.w3.org/2000/svg"
              id="a"
              viewBox="0 0 63.67 62.2"
            >
              <defs></defs>
              <path
                className="b"
                d="M32,0c3.77,0,6.85,3.1,6.85,6.9s-3.07,6.9-6.85,6.9-6.85-3.1-6.85-6.9S28.23,0,32,0"
                fill="#fff"
              />
              <path
                className="b"
                d="M7.06,22.26v.03c-.02,.12-.03,.20-.03,.25,0,.36,.2,.62,.6,.80,.41,.17,1.03,.26,1.88,.26,.65,0,1.15-.07,1.52-.21,.37-.14,.55-.34,.55-.59,0-.38-.73-.68-2.17-.92-.17-.03-.30-.05-.38-.06-.09-.02-.23-.04-.41-.07-2.3-.38-3.78-.79-4.44-1.23-.32-.22-.56-.47-.73-.76-.16-.29-.24-.62-.24-.99,0-.9,.53-1.59,1.59-2.06,1.06-.47,2.61-.71,4.64-.71s3.5,.22,4.47,.66c.97,.44,1.45,1.12,1.45,2.04v.11h-3.81v-.04c0-.32-.19-.55-.58-.72-.39-.16-.95-.25-1.7-.25-.58,0-1.03,.06-1.33,.17-.32,.12-.47,.28-.47,.49,0,.38,.83,.71,2.49,.97,.32,.05,.57,.09,.75,.12,1.18,.20,2.03,.37,2.53,.51,.5,.14,.93,.31,1.3,.50,.4,.22,.72,.50,.94,.84,.22,.34,.33,.71,.33,1.12,0,.93-.58,1.64-1.73,2.15-1.15,.50-2.81,.75-4.97,.75s-3.69-.24-4.64-.72c-.96-.48-1.43-1.25-1.43-2.32v-.14H7.06Zm10.44,3.02v-9.14h10.87v1.97h-6.79v1.46h6.27v1.95h-6.27v1.77h7.04v2h-11.12Zm12.83,0v-9.14h5.16l5.53,6.14v-6.14h3.92v9.14h-5.36l-5.35-6.16v6.16h-3.91Zm25.15-3.65l-1.95-3.32-2.06,3.32h4.02Zm-6.22,3.65h-4.09l6.32-9.14h4.53l6.03,9.14h-4.54l-.92-1.65h-6.33l-.98,1.65Z"
                fill="#fff"
              />
              <path
                className="b"
                d="M12.08,57.52l-3.65-3.43,11.1-19.29c.6-1.05-.15-2.37-1.36-2.37H0v-4.83H29.24L12.08,57.52Z"
                fill="#fff"
              />
              <path
                className="b"
                d="M51.6,57.52l3.65-3.43-11.1-19.29c-.6-1.05,.15-2.37,1.36-2.37h18.17v-4.83h-29.24l17.16,29.92Z"
                fill="#fff"
              />
              <path
                className="b"
                d="M31.8,32.7s.04-.07,.04-.07l16.48,27.28-4.38,2.28-10.62-17.81c-.63-1.05-2.14-1.05-2.76,0-3.54,5.98-10.55,17.81-10.55,17.81l-4.28-2.12s15.19-25.87,16.07-27.37"
                fill="#fff"
              />
            </svg>
          </div>
          <div id="notiAlerta" className="boxNotificaciones">
            {alert !== 0 && (
              <div className="boxcontadorNoti">
                <span>{alert}</span> {/* contador de notoficaciones */}
              </div>
            )}
            <IconBell className="iconAlert" />
          </div>


          <div id="userAlert" className="usuario">
            <IconUser className="user1" />
            <div className="cargoUser">
              <span className="nombreTamañousuario">{userName}</span>
              <span className="tamañocargoUsuario">Cargo: {userRoll}</span>
            </div>
          </div>
        </div>

        {/* caja de notificaciones */}
        <div className="modalCloseNoti">
          <div className="notificacionesSpace">
            <div className="contentXsalir">
              <div className="tituloNotify">
                <h3 className="tamañoTextNoti">¡Aviso!</h3>
              </div>
              <div className="boxCloserIcon">
                <IconX className="closeNotii" id="closeNoti" />
              </div>
            </div>
            <div className="textModalNoti">
              <span>Quedan Pocas Unidades de:</span>
            </div>
            <div className="TableNoti">
              <table className="table table22">
                <thead>
                  <tr className="textTituloNoti">
                    <th scope="col">Producto</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {alert > 0 ? (
                    <>
                      {elementoAlmacenado.map((element, index) => (
                        <tr key={index} className="textContenidoNoti">
                          <td style={{ textTransform: 'capitalize' }}>{element.NombreProducto} </td>
                          <td style={{ textTransform: 'capitalize' }}>{element.NombreCategoria}</td>
                          <td className="text-center">{element.Cantidad}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={3}>Nada por mostrar</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>



        <div className="modalClose">
          <div className="userSpace">
            <div className="contentXsalirUser">
              <IconX className="closeUser" id="closeX" />
            </div>
            <Link to="/ajustes" className="letraUser ax">
              <IconSettings className="iconModal" />
              <span>Ajustes</span>
            </Link>
            <Link
              onClick={() => (localStorage.clear(), window.location.reload())}
              className="letraCerrarSesion"
            >
              <IconUserOff className="iconModal" />
              <span>Cerrar sesión</span>
            </Link>
          </div>
        </div>


        <div className="contenido">
          <div className="contSeg">
            <Outlet />
            <div className="espacioBotton"></div>

          </div>
        </div>
      </div >
    </>
  );
};
export default Menu;
