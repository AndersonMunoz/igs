import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/login.css';
import Sweet from '../helpers/Sweet2';



const LoginForm = () => {
  const [modal, setModal]= useState(false) 
  const [documento, setUser]= useState('')
  const [contrasena, setPassword]= useState('')
  
  
  function handleSubmit  () {
    
    fetch('http://localhost:3000/aut/validar',{
      method:'post',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({documento,contrasena})
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data.token);
      if (data.status===200) {
        Sweet.logIn(data.message)
        localStorage.setItem('token',data.token)
      }else{
        Sweet.error(data.message)
      }
    })

  };
  return (
    <div>
      <header>
        <div className="sena">
          <svg className="logoSena" xmlns="http://www.w3.org/2000/svg" id="a" viewBox="0 0 63.67 62.2">
            {/* Agrega el contenido del logo SVG aquí */}
          </svg>
        </div>
        <div className="titleIgs">
          <h1>INVENTARIO GASTRONOMICO SENA</h1>
        </div>
        <div className="container-logo">
          <img src="img/logotrans.png" alt="" className="logoigs" />
        </div>
      </header>

      <div className="nav">
        <div id="UserInicio" className="inicio">
          <button type="button" onClick={()=>{setModal(true)}}>log in</button>
          {/* <span>Iniciar Sesion</span> */}
        </div>
      </div>

      {/* Aquí puedes agregar el código para el carousel si lo deseas */}

      <div className="userOculto" style={{display: modal == true ? 'block' : 'none'}}>
        <div className="wrapper bg-white">
          <i id="closeX" className="closeUser ti ti-x"></i>
          <div className="h2 text-center">LOGIN IGS</div>
          <div className="h4 text-muted text-center pt-2">Ingresa tus Datos</div>
          <form className="pt-3">
            <div className="form-group py-2">
              <div className="input-field"> <span className="far fa-user p-2"></span> 
              <input type="text" id='UserName'placeholder="Email/Documento" required value={documento} onChange={(e)=>setUser(e.target.value)}/> </div>
            </div>
            <div className="form-group py-1 pb-2">
              <div className="input-field"> <span className="fas fa-lock p-2"></span> 
              <input type="text" id='password' placeholder="Contraseña" required value={contrasena} onChange={(e)=>setPassword(e.target.value)} /> <button className="btn bg-white text-muted"> <span className="far fa-eye-slash"></span> </button> </div>
            </div>
            <div className="d-flex align-items-start">
              <div className="remember"> <label className="option text-muted"> Recordarme <input type="radio" name="radio" /> <span className="checkmark"></span> </label> </div>
              <div className="ml-auto"> <a href="#" id="forgot">¿Olvidaste Contraseña?</a> </div>
            </div>
            <button className="btn btn-block text-center my-3" onClick={()=>{handleSubmit()  }}><a href="#"> Iniciar Sesion</a></button>
          </form>
        </div>
      </div>

      <footer>
        {/* <div className="footer-container">
          <div className="footer-loge">
            <img src="img/logoigs.jpeg" alt="" />
          </div>
          <div className="box-footer-1">
            <div className="footer-space-1">
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime,aut? Numquam eos illo culpa animi magni sunt aliquid rem. Optio sit,doloribus nam deleniti ipsam quasi exercitationem debitis natusbeatae!</p>
            </div>
            <div className="footer-space-2">
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt isteconsectetur corporis voluptatibus nemo eum error omnis. Quisquamdoloribus laboriosam nam veritatis atque laudantium, ipsum voluptatem,necessitatibus, quasi dignissimos sint!</p>
            </div>
          </div>
          <div className="box-footer-2">
            <div className="footer-loge-2">
              <img src="img/iconoindex.ico" alt="" />
            </div>
            <div className="footer-copyRight">
              <div className="copyRight">
                Copyright &copy; IGS <span className="yearCopi"></span> todos los derechos reservados.
              </div>
            </div>
          </div>
        </div> */}
      </footer>
    </div>
  );
};

export default LoginForm;
