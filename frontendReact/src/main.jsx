import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from "./Main/Main"
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.min.css'



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>
)
