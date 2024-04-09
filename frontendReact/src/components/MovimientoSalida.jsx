import React, { useState, useEffect, useRef } from "react"; // Importar React y hooks
import { Link } from "react-router-dom"; // Importar Link de react-router-dom para enlaces
import Sweet from '../helpers/Sweet'; // Importar Sweet para notificaciones
import { dataDecript } from "./encryp/decryp"; // Importar función de desencriptación
import Validate from '../helpers/Validate'; // Importar Validate para validaciones
import '../style/movimiento.css'; // Importar estilos para el componente Movimiento
import { IconEdit } from "@tabler/icons-react"; // Importar IconEdit de Tabler Icons
import ExelLogo from "../../img/excel.224x256.png"; // Importar imagen de logo de Excel
import PdfLogo from "../../img/pdf.224x256.png"; // Importar imagen de logo de PDF
import esES from '../languages/es-ES.json'; // Importar archivo de traducción para español
import $ from 'jquery'; // Importar jQuery
import 'bootstrap'; // Importar Bootstrap
import 'datatables.net'; // Importar DataTables
import 'datatables.net-bs5'; // Importar DataTables con Bootstrap 5
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'; // Estilos de DataTables con Bootstrap 5
import 'datatables.net-responsive'; // Importar DataTables Responsive
import 'datatables.net-responsive-bs5'; // Importar DataTables Responsive con Bootstrap 5
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css'; // Estilos de DataTables Responsive con Bootstrap 5
import generatePDF from 'react-to-pdf'; // Importar generador de PDF a partir de componente React
import * as xlsx from 'xlsx'; // Importar librería para manipulación de archivos Excel
import jsPDF from 'jspdf'; // Importar librería para generar documentos PDF
import autoTable from 'jspdf-autotable'; // Importar librería para generar tablas en documentos PDF automáticamente
import portConexion from "../const/portConexion"; // Importar configuración de puerto de conexión
import Select from 'react-select'; // Importar componente de selección personalizada

const Movimiento = () => { // Definir componente Movimiento
  // Definir estados del componente
  const [userId, setUserId] = useState(''); // Estado para el ID de usuario
  const [movimientos, setMovimientos] = useState([]); // Estado para la lista de movimientos
  const [productosCategoria, setProCat] = useState([]); // Estado para la lista de productos por categoría
  const [userRoll, setUserRoll] = useState(""); // Estado para el rol del usuario
  const [unidadesProductos, setUniPro] = useState([]); // Estado para la lista de unidades de productos
  const [categoria_list, setcategorias_producto] = useState([]); // Estado para la lista de categorías de productos
  const [proveedor_list, setProveedor] = useState([]); // Estado para la lista de proveedores
  const [tipos, setTipo] = useState([]); // Estado para la lista de tipos
  const [usuario_list, setUsuario] = useState([]); // Estado para la lista de usuarios
  const [showModal, setShowModal] = useState(false); // Estado para mostrar o ocultar el modal
  const [updateModal, setUpdateModal] = useState(false); // Estado para actualizar el modal
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState({}); // Estado para el movimiento seleccionado
  const [selectedTipo, setSelectedTipo] = useState(null); // Estado para el tipo seleccionado
  const [selectedCategoria, setSelectedCategoria] = useState(null); // Estado para la categoría seleccionada
  const [selectedOption, setSelectedOption] = useState(null); // Estado para la opción seleccionada
  const [selectedOptionTit, setSelectedOptionTit] = useState(null); // Estado para la opción de titulado seleccionada
  const [selectedOptionIns, setSelectedOptionIns] = useState(null); // Estado para la opción de instructor seleccionada
  const [destinoMovimiento, setDestinoMovimiento] = useState(''); // Estado para el destino del movimiento
  const [tituladoList, setTitulado] = useState(null); // Estado para la lista de titulados
  const [selectedTitulado, setSelectedTitulado] = useState(null); // Estado para el titulado seleccionado
  const [instructorList, setInstrucor] = useState(null); // Estado para la lista de instructores
  const [selectedInstructor, setSelectedInstructor] = useState(null); // Estado para el instructor seleccionado
  const [showInstructorTituladoSelects, setShowInstructorTituladoSelects] = useState(false); // Estado para mostrar u ocultar selects de instructor y titulado
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(''); // Estado para la unidad seleccionada
  const [fkIdProducto, setFkIdProducto] = useState(null); // Estado para el ID de producto

  // Referencias a modales
  const modalUpdateRef = useRef(null); // Referencia al modal de actualización
  const modalProductoRef = useRef(null); // Referencia al modal de producto

  // Función para exportar a Excel
  const handleOnExport = () => {
    const wsData = getTableData(); // Obtener datos de la tabla
    const wb = xlsx.utils.book_new(); // Crear libro de trabajo
    const ws = xlsx.utils.aoa_to_sheet(wsData); // Crear hoja de trabajo
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelT  Salida'); // Agregar hoja al libro con nombre
    xlsx.writeFile(wb, 'MovimientoSalida.xlsx'); // Escribir archivo Excel
  };

  // Función para exportar a PDF
  const exportPdfHandler = () => {
    const doc = new jsPDF('landscape'); // Crear documento PDF en orientación horizontal
  
    const columns = [ // Definir columnas para la tabla en el PDF
      { title: 'Nombre producto', dataKey: 'nombre_tipo' },
      { title: 'Categoría', dataKey: 'nombre_categoria' },
      { title: 'Tipo categoría', dataKey: 'tipo_categoria' },
      { title: 'Código categoría', dataKey: 'codigo_categoria' },
      { title: 'Fecha del movimiento', dataKey: 'fecha_movimiento' },
      { title: 'Tipo de movimiento', dataKey: 'tipo_movimiento' },
      { title: 'Cantidad', dataKey: 'cantidad_peso_movimiento' },
      { title: 'Unidad Peso', dataKey: 'unidad_peso' },
      { title: 'Nota', dataKey: 'nota_factura' },
      { title: 'Usuario que hizo movimiento', dataKey: 'nombre_usuario' },
      { title: 'Destino', dataKey: 'destino_movimiento' },
      { title: 'Titulado', dataKey: 'nombre_titulado' },
      { title: 'ID ficha', dataKey: 'id_ficha' },
      { title: 'Instructor', dataKey: 'nombre_instructor' }
    ];
  
    // Obtener los datos de la tabla
    const tableData = movimientos.map((element) => ({
      nombre_tipo: element.nombre_tipo,
      nombre_categoria: element.nombre_categoria,
      tipo_categoria: element.tipo_categoria,
      codigo_categoria: element.codigo_categoria,
      fecha_movimiento: Validate.formatFecha(element.fecha_movimiento),
      tipo_movimiento: element.tipo_movimiento,
      cantidad_peso_movimiento: element.cantidad_peso_movimiento,
      unidad_peso: element.unidad_peso,
      nota_factura: element.nota_factura,
      nombre_usuario: element.nombre_usuario,
      destino_movimiento: element.destino_movimiento,
      nombre_titulado: element.nombre_titulado,
      id_ficha: element.id_ficha,
      nombre_instructor: element.nombre_instructor,
    }));
  
    // Agregar las columnas y los datos a la tabla del PDF
    doc.autoTable({
      columns,
      body: tableData,
      margin: { top: 20 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [0,100,0] }, // Estilo del encabezado de la tabla
    });
  
    // Guardar el PDF
    doc.save('MovimientosSalida.pdf');
  };

  // Función para obtener los datos de la tabla
  const getTableData = () => {
    const wsData = []; // Array para almacenar los datos de la tabla

    // Definir las columnas de la tabla
    const columns = [
      'Nombre producto',
      'Categoría',
      'Tipo categoría',
      'Código categoría',
      'Fecha del movimiento',
      'Tipo de movimiento',
      'Cantidad',
      'Unidad',
      'Nota',
      'Usuario que hizo movimiento',
      'Destino movimiento',
      'Titulado',
      'ID ficha',
      'Instructor'
    ];
    wsData.push(columns); // Añadir las columnas al array de datos

    // Obtener los datos de las filas y añadirlos al array de datos
    movimientos.forEach(element => {
      const rowData = [
        element.nombre_tipo,
        element.nombre_categoria,
        element.tipo_categoria,
        element.codigo_categoria,
        Validate.formatFecha(element.fecha_movimiento),
        element.tipo_movimiento,
        element.cantidad_peso_movimiento,
        element.unidad_peso,
        element.nota_factura,
        element.nombre_usuario,
        element.destino_movimiento,
        element.nombre_titulado,
        element.id_ficha,
        element.nombre_instructor
      ];
      wsData.push(rowData); // Añadir la fila al array de datos
    });

    return wsData; // Devolver los datos de la tabla
  };
  // Función para restablecer el estado del formulario
const resetFormState = () => {
  // Seleccionar todos los campos del formulario en el modal de producto
  const formFields = modalProductoRef.current.querySelectorAll('.form-control,.form-update,.my-custom-class,.form-empty, select, input[type="number"], input[type="checkbox"]');
  // Seleccionar todos los campos del formulario en el modal de actualización
  const formFields2 = modalUpdateRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
  // Iterar sobre los campos del formulario en el modal de producto y del modal de actualización
  formFields.forEach(field => {
    if (field.type === 'checkbox') { // Si el campo es de tipo checkbox
      field.checked = false; // Desmarcar la casilla
    } else { // Si el campo no es de tipo checkbox
      field.value = ''; // Limpiar el valor del campo
    }
    field.classList.remove('is-invalid'); // Eliminar la clase 'is-invalid' para el campo
  });
  formFields2.forEach(field => {
    if (field.type === 'checkbox') { // Si el campo es de tipo checkbox
      field.checked = false; // Desmarcar la casilla
    } else { // Si el campo no es de tipo checkbox
      field.value = ''; // Limpiar el valor del campo
    }
    field.classList.remove('is-invalid'); // Eliminar la clase 'is-invalid' para el campo
  });
};

// Función para manejar el cambio de la categoría seleccionada
const handleCategoria = (selectedOption) => {
  setSelectedCategoria(selectedOption); // Actualizar estado de categoría seleccionada
  setSelectedOption(null); // Reiniciar estado de opción seleccionada
  setSelectedTipo(null); // Reiniciar estado de tipo seleccionado
  setUnidadSeleccionada('No hay unidad de medida'); // Establecer unidad de medida predeterminada
};

// Función para manejar el cambio del tipo seleccionado
const handleTipo = (selectedOption) => {
  setSelectedOption(selectedOption); // Actualizar estado de opción seleccionada
  setSelectedTipo(selectedOption.value.id_tipo); // Actualizar estado de tipo seleccionado
  listarUnidadesPro(selectedOption.value.id_tipo); // Listar unidades de producto asociadas al tipo seleccionado
  setFkIdProducto(selectedOption.value.id_producto); // Establecer ID de producto seleccionado
};

// Función para manejar el cambio del titulado seleccionado
const handleTitulado = (selectedOptionTit) => {
  setSelectedOptionTit(selectedOptionTit); // Actualizar estado de opción de titulado seleccionada
  setSelectedTitulado(selectedOptionTit.value); // Actualizar estado de titulado seleccionado
};

// Función para manejar el cambio del instructor seleccionado
const handleInstructor = (selectedOptionIns) => {
  setSelectedOptionIns(selectedOptionIns); // Actualizar estado de opción de instructor seleccionada
  setSelectedInstructor(selectedOptionIns.value); // Actualizar estado de instructor seleccionado
};

// Función para manejar el cambio del destino de movimiento
const handleDestino = (event) => {
  const selectedDestino = event.target.value;

  // Actualizar estado de destino de movimiento
  setDestinoMovimiento(selectedDestino, () => {
    // Mostrar u ocultar selectores de instructor y titulado según el destino seleccionado
    setShowInstructorTituladoSelects(selectedDestino === "taller" || selectedDestino === "evento");

    // Llamar a las funciones para listar titulados e instructores si el destino seleccionado es "taller" o "evento"
    if (selectedDestino === "taller" || selectedDestino === "evento") {
      listarTitulado(); // Listar titulados disponibles
      listarInstructor(); // Listar instructores disponibles
    }
  });
};



// Llamar a las funciones para listar titulados e instructores después de que el estado destinoMovimiento se haya actualizado
useEffect(() => {
  listarTitulado(); // Listar titulados disponibles
  listarInstructor(); // Listar instructores disponibles
}, [destinoMovimiento]);

const handleDestino2 = (event) => {
  const selectedDestino = event.target.value;
  //console.log("selectedDestino:", selectedDestino); // Depurar

  setDestinoMovimiento(selectedDestino);

  // Actualiza el estado de showInstructorTituladoSelects solo si el destino seleccionado es "taller" o "evento"
  const showSelects = selectedDestino === "taller" || selectedDestino === "evento";
  //console.log("showSelects:", showSelects); // Depurar
  setShowInstructorTituladoSelects(showSelects);

  // Restablece el estado del selector de instructor
  if (!showSelects) {
    setSelectedOptionIns(null);
    setSelectedInstructor(null);
  }

  // Llama a las funciones para cargar los datos de instructor y titulado si es necesario
  if (showSelects) {
    //console.log("Llamando a listarInstructor y listarTitulado"); // Depurar
    listarInstructorAct();
    listarTituladoAct();
  }
};

// Estado para rastrear si los datos se están cargando
const [isLoading, setIsLoading] = useState(true);

// Llama a las funciones para cargar los datos de instructor y titulado si es necesario
useEffect(() => {
  // Llama a las funciones para cargar los datos de instructor y titulado si es necesario
  if (showInstructorTituladoSelects) {
    setIsLoading(true);
    Promise.all([listarInstructorAct(), listarTituladoAct()])
      .then(() => {
        setIsLoading(false);
      });
  }
}, [showInstructorTituladoSelects]);

// Efecto para controlar la visualización de los selects de instructor y titulado según el destino de movimiento seleccionado
useEffect(() => {
  const destino = movimientoSeleccionado.destino_movimiento;
  const showSelects = destino === "taller" || destino === "evento";
  setShowInstructorTituladoSelects(showSelects);
}, [movimientoSeleccionado.destino_movimiento]);

// Referencia al elemento de la tabla
const tableRef = useRef();
// Referencia al ID de usuario
const fkIdUsuarioRef = useRef(null);

// Estado para controlar si aplica la fecha de caducidad
const [aplicaFechaCaducidad2, setAplicaFechaCaducidad2] = useState(false);

// Función para manejar el cambio del checkbox de fecha de caducidad
const handleCheckboxChange2 = () => {
  setAplicaFechaCaducidad2(!aplicaFechaCaducidad2);
};

// Efecto para inicializar o destruir la tabla DataTable al cambiar los movimientos
useEffect(() => {
  if (movimientos.length > 0) {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
    $(tableRef.current).DataTable({
      columnDefs: [
        {
          targets: -1,
          responsivePriority: 1
        }
      ],
      responsive: true,
      language: esES,
      paging: true,
      select: {
        'style': 'multi',
        'selector': 'td:first-child',
      },
      lengthMenu: [
        [10, 50, 100, -1],
        ['10 Filas', '50 Filas', '100 Filas', 'Ver Todo']
      ],
    });
  }
  setUserRoll(dataDecript(localStorage.getItem("roll")));
}, [movimientos]);

// Función para eliminar el backdrop del modal
function removeModalBackdrop() {
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
}

// Efecto para cargar los datos iniciales al cargar la página o al cambiar la categoría o tipo seleccionado
// Efecto para inicializar o destruir la tabla DataTable al cambiar los movimientos
useEffect(() => {
  if (movimientos.length > 0) {
    // Verificar si la tabla DataTable ya existe y destruirla si es necesario
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
    // Crear la tabla DataTable con las opciones especificadas
    $(tableRef.current).DataTable({
      columnDefs: [
        {
          targets: -1,
          responsivePriority: 1
        }
      ],
      responsive: true,
      language: esES,
      paging: true,
      select: {
        'style': 'multi',
        'selector': 'td:first-child',
      },
      lengthMenu: [
        [10, 50, 100, -1],
        ['10 Filas', '50 Filas', '100 Filas', 'Ver Todo']
      ],
    });
  }
  // Decodificar y establecer el rol de usuario
  setUserRoll(dataDecript(localStorage.getItem("roll")));
}, [movimientos]); // Dependencia: movimientos, se ejecuta cuando cambia la lista de movimientos

// Función para eliminar el backdrop del modal
function removeModalBackdrop() {
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
}

// Efecto para cargar los datos iniciales al cargar la página o al cambiar la categoría o tipo seleccionado
useEffect(() => {
  // Decodificar y establecer el ID de usuario
  setUserId(dataDecript(localStorage.getItem('id')));
  // Recargar la página al retroceder en el historial del navegador
  window.onpopstate = function(event) {
    window.location.reload();
  };
  // Listar movimientos, categorías, tipos, proveedores, usuarios, titulados, instructores, titulados activos e instructores activos
  listarMovimiento();
  listarCategoria();
  listarTipo();
  listarProveedor();
  listarUsuario();
  listarTitulado();
  listarInstructor();
  listarTituladoAct();
  listarInstructorAct();
  // Listar productos de la categoría seleccionada si existe
  if (selectedCategoria) {
    listarProductoCategoria(selectedCategoria.value);
  }
  // Listar unidades de producto del tipo seleccionado si existe
  if (selectedTipo) {
    listarUnidadesPro(selectedOption.value.id_tipo);
  }
}, [selectedCategoria, selectedTipo]); // Dependencias: selectedCategoria, selectedTipo, se ejecuta cuando cambia alguna de estas dos variables


  // Función para listar las categorías
function listarCategoria() {
  fetch(`http://${portConexion}:3000/categoria/listar`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (res.status === 204) {
        //console.log("No hay datos disponibles");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data !== null) {
        // Establecer las categorías obtenidas del servidor
        setcategorias_producto(data);
        // Listar titulados e instructores después de obtener las categorías
        listarTitulado();
        listarInstructor();
      }
    })
    .catch((e) => {
      //console.log(e);
    });
}

// Función para listar los titulados
function listarTitulado() {
  fetch(`http://${portConexion}:3000/titulado/listaractivo`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (res.status === 204) {
        //console.log("No hay datos disponibles");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data !== null) {
        // Establecer los titulados activos obtenidos del servidor
        setTitulado(data);
      }
    })
    .catch((e) => {
      //console.log(e);
    });
}

// Función para listar los instructores
function listarInstructor() {
  fetch(`http://${portConexion}:3000/instructor/listarActivo`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (res.status === 204) {
        //console.log("No hay datos disponibles");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data !== null) {
        // Establecer los instructores activos obtenidos del servidor
        setInstrucor(data);
      }
    })
    .catch((e) => {
      //console.log(e);
    });
}

  // Función para listar los titulados en actualizar
function listarTituladoAct() {
  fetch(`http://${portConexion}:3000/titulado/listaractivo`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (res.status === 204) {
        //console.log("No hay datos disponibles");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      //console.log("Datos de titulado recibidos:", data);
      if (data !== null) {
        // Formatear la lista de titulados para el componente React-Select
        const formattedTituladoList = data.map(titulado => ({
          value: titulado.id_titulado,
          label: `${titulado.nombre_titulado} - ${titulado.id_ficha}` 
        }));
        // Establecer la lista de titulados formateada en el estado
        setTitulado(formattedTituladoList);
      }
    })
    .catch((e) => {
      //console.log(e);
    });
}

// Función para listar los instructores en actualizar
function listarInstructorAct() {
  fetch(`http://${portConexion}:3000/instructor/listarActivo`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (res.status === 204) {
        //console.log("No hay datos disponibles");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      //console.log("Datos de instructor recibidos:", data);
      if (data !== null) {
        // Formatear la lista de instructores para el componente React-Select
        const formattedInstructorList = data.map(instructor => ({
          value: instructor.id,
          label: instructor.nombre
        }));
        // Establecer la lista de instructores formateada en el estado
        setInstrucor(formattedInstructorList);
      }
    })
    .catch((e) => {
      //console.log("Error al obtener datos de instructor:", e);
    });
}

// Función para listar los tipos de productos
function listarTipo() {
  fetch(`http://${portConexion}:3000/tipo/listar`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (res.status === 204) {
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data !== null) {
        // Establecer la lista de tipos de productos en el estado
        setTipo(data);
      }
    })
    .catch((e) => {
      console.error("Error al procesar la respuesta:", e);
    });
}

// Función para listar los proveedores
function listarProveedor() {
  fetch(`http://${portConexion}:3000/proveedor/listar`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // Establecer la lista de proveedores en el estado
      setProveedor(data);
    })
    .catch((e) => {
      //console.log(e);
    });
}

 // Función para listar los productos de una categoría específica
function listarProductoCategoria(id_categoria) {
  fetch(
    `http://${portConexion}:3000/facturamovimiento/buscarProPro/${id_categoria == '' ? 0 : id_categoria}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token")
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      setUniPro([]);
      setProCat(data);
      //console.log("PRODUCTO - CATEGORIA : ", data);
    })
    .catch((e) => {
      setProCat([]);
      //console.log("Error:: ", e);
    });
}

// Función para listar las unidades de un producto específico
function listarUnidadesPro(id_producto) {
  fetch(
    `http://${portConexion}:3000/facturamovimiento/buscarUnidad/${id_producto}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token")
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      setUnidadSeleccionada(data[0].unidad_peso)
    })
    .catch((e) => {
      setUnidadSeleccionada('No hay unidad de medida');
      //console.log("Error al obtener unidades:", e);
    });
}

// Función para editar un movimiento
function editarMovimiento(id) {
  fetch(`http://${portConexion}:3000/facturamovimiento/buscar/${id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.getItem("token")
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      setMovimientoSeleccionado(data[0]);
      setUpdateModal(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Función para editar el detalle del destino de un movimiento
function editarDetalleDestino(id) {
  fetch(`http://${portConexion}:3000/facturamovimiento/buscarDetalleMovimiento/${id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.getItem("token")
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      setMovimientoSeleccionado(data[0]);
      setUpdateModal(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Función para actualizar un movimiento
function actualizarMovimiento(id) {
  const validacionExitosa = Validate.validarCampos('.form-update');
  fetch(`http://${portConexion}:3000/facturamovimiento/actualizarSalida/${id}`, {
    method: "PUT",
    headers: {
      'Content-type': 'application/json',
      token: localStorage.getItem("token")
    },
    body: JSON.stringify(movimientoSeleccionado),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((json) => {
          let errorMessage = json.errors ? json.errors[0].msg : json.mensaje;
          throw new Error(errorMessage);
        });
      }
      return res.json();
    })
    .then((data) => {
      if (data.status === 200) {
        Sweet.exito(data.message);
        listarMovimiento();
        setUpdateModal(false);
        removeModalBackdrop(true);
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }
      } else if (data.status === 400 || data.status === 403) {
        Sweet.error(data.error.errors[0].msg);
      } else if (data.status === 402) {
        Sweet.error(data.mensaje);
      } else if (data.status === 409) {
        Sweet.error(data.message);
      } else {
        listarMovimiento();
        setUpdateModal(false);
        removeModalBackdrop(true);
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
    })
    .catch((error) => {
      //console.error('Error:', error);
      Sweet.error(error.message);
    });
}
  // Función para listar los usuarios
function listarUsuario() {
  fetch(`http://${portConexion}:3000/usuario/listar`, {
    method: "get",
    headers: {
      "content-type": "application/json",
      token: localStorage.getItem("token")
    }
  })
    .then((res) => {
      if (res.status === 204) {
        return null;
      }
      return res.json();
    })
    .then((data) => {
      setUsuario(data);
    })
    .catch((e) => {
      console.log(e);
    });
}

// Función para registrar un movimiento de salida
function registrarMovimientoSalida() {
  let fk_id_usuario = userId;
  let cantidad_peso_movimiento = document.getElementById('cantidad_peso_movimiento').value;
  let nota_factura = document.getElementById('nota_factura').value;
  let destino_movimiento = document.getElementById('destino_movimiento').value;
  let fk_id_producto = fkIdProducto ? fkIdProducto : null;
  let fk_id_tipo_producto = selectedTipo ? selectedTipo : null;
  let fk_id_titulado = null;
  let fk_id_instructor = null;

  if (destino_movimiento === "taller" || destino_movimiento === "evento") {
    fk_id_titulado = selectedOptionTit ? selectedOptionTit.value : null;
    fk_id_instructor = selectedOptionIns ? selectedOptionIns.value : null;
  }

  Validate.validarCampos('.form-empty');
  const validacionExitosa = Validate.validarSelect('.form-empt');

  if (!validacionExitosa) {
    Sweet.registroFallido();
    return;
  }

  fetch(`http://${portConexion}:3000/facturamovimiento/registrarSalida`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token")
    },
    body: JSON.stringify({ cantidad_peso_movimiento, nota_factura, destino_movimiento, fk_id_tipo_producto, fk_id_producto, fk_id_usuario, fk_id_titulado, fk_id_instructor }),
  })
    .then((res) => res.json())
    .then(data => {
      if (data.status === 200) {
        Sweet.exito(data.message);
        setShowModal(false);
        removeModalBackdrop(true);
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }
        listarMovimiento();
      } else if (data.status === 403) {
        Sweet.error(data.error.errors[0].msg);
      } else if (data.status === 402) {
        Sweet.error(data.mensaje);
      } else if (data.status === 409) {
        Sweet.error(data.message);
      } else {
        listarMovimiento();
        setShowModal(false);
        removeModalBackdrop(true);
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Función para listar los movimientos de salida
function listarMovimiento() {
  fetch(`http://${portConexion}:3000/facturamovimiento/listarSalida`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      token: localStorage.getItem("token")
    },
  })
    .then((res) => {
      if (res.status === 204) {
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setMovimientos(data);
      }
    })
    .catch((e) => {
      //console.log(e);
    });
}

  return (
    <>
      <div>
        <h1 className="text-center modal-title fs-5 m-4">Movimientos de Salida</h1>
        <div className="d-flex justify-content-between mb-4">
          <div>
          <button type="button" className="btn-color btn  m-1 " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setShowModal(true); Validate.limpiar('.limpiar'); resetFormState();setSelectedTipo(null);setSelectedCategoria(null);setSelectedOptionIns(null);setDestinoMovimiento(""),setUnidadSeleccionada(null);setSelectedOptionTit(null);setSelectedOption(null); listarInstructor(); listarTitulado();}}>
              Registrar nuevo movimiento de Salida
          </button>
          <Link to="/movimiento"><button type="button"  className="btn btn-primary m-1 ">Volver a Movimientos Totales</button></Link>
          
          </div>
          <div className="btn-group" role="group" aria-label="Basic mixed styles example">
            <div className="" title="Descargar Excel">
            <div className="" title="Descargar Excel">
            <button onClick={handleOnExport} type="button" className="btn btn-light">
                <img src={ExelLogo} className="logoExel" />
                </button>
            </div>
            </div>
            <div className="" title="Descargar Pdf">
              <button
                type="button"
                className="btn btn-light"
                onClick={exportPdfHandler}
              >
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
        </div>
        <div className="container-fluid w-full">
          <table id="dtBasicExample"
            className="table table-striped table-bordered border display responsive nowrap b-4"
            ref={tableRef}
            cellSpacing={0}
            width="100%">
            <thead className="text-center text-justify">
              <tr>
                <th className="th-sm">N°</th>
                <th className="th-sm">Nombre producto</th>
                <th className="th-sm">Categoria</th>                
                <th className="th-sm">Código categoría</th>
                <th className="th-sm">Tipo categoría</th>                
                <th className="th-sm">Fecha del movimiento</th>
                <th className="th-sm">Tipo de movimiento</th>
                <th className="th-sm">Cantidad</th>
                <th className="th-sm">Unidad</th>
                <th className="th-sm">Nota</th>
                <th className="th-sm">Usuario que hizo movimiento</th>
                <th className="th-sm">Destino</th>
                <th className="th-sm">Titulado</th>
                <th className="th-sm">ID ficha</th>
                <th className="th-sm">Instructor</th>
                <th className="th-sm">Editar</th>
              </tr>
            </thead>
            <tbody id="tableMovimiento">
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={16}>
                    <div className="d-flex justify-content-center">
                      <div className="alert alert-danger text-center mt-4 w-50">
                        <h2> En este momento no contamos con ningún movimiento disponible.😟</h2>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {movimientos.map((element,index) => (
                    <tr style={{ textTransform: 'capitalize' }} key={element.id_factura}>
                      <td className="p-2 text-center" >{index +1}</td>
                      <td className="p-2 text-center">{element.nombre_tipo}</td>
                      <td className="p-2 text-center">{element.nombre_categoria}</td>
                      <td className="p-2 text-center">{element.codigo_categoria}</td>
                      <td className="p-2 text-center">{element.tipo_categoria}</td>
                      <td className="p-2 text-center">{Validate.formatFecha(element.fecha_movimiento)}</td>
                      <td className="p-2 text-center">{element.tipo_movimiento}</td>
                      <td className="p-2 text-center" >
                        {Number.isInteger(element.cantidad_peso_movimiento) ? element.cantidad_peso_movimiento : element.cantidad_peso_movimiento.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">{element.unidad_peso}</td>
                      <td className="p-2 text-center">{element.nota_factura}</td>
                      <td className="p-2 text-center">{element.nombre_usuario}</td>
                      <td className="p-2 text-center">{element.destino_movimiento.charAt(0).toUpperCase() + element.destino_movimiento.slice(1).toLowerCase()}</td>
                      <td className="p-2 text-center">{element.nombre_titulado}</td>
                      <td className="p-2 text-center">{element.id_ficha}</td>
                      <td className="p-2 text-center">{element.nombre_instructor}</td>

                      <td className="p-0 text-center"  > 
                      { (userRoll === "administrador") ? (
                        
                        <button className="btn btn-color"onClick={() => { setUpdateModal(true); editarMovimiento(element.id_factura); resetFormState();}} data-bs-toggle="modal" data-bs-target="#movimientoEditarModal">
                        <IconEdit />
                        </button>
                      ) :(

                        <span>No disponible</span>
                      )}
                  </td>
                    </tr>

                  ))}</>)}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center align-items-center w-80 h-full">
          <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalProductoRef} style={{ display: showModal ? 'block' : 'none' }} >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header txt-color">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Registro de movimiento de salida</h1>
                  <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="categoria">Categoria</label>
                              <Select
                                className="react-select-container form-empty limpiar my-custom-clas form-empt"
                                classNamePrefix="react-select"
                                options={categoria_list.map(element => ({ value: element.id_categoria, label: element.nombre_categoria}))}
                                placeholder="Selecciona..."
                                onChange={handleCategoria}
                                value={selectedCategoria}
                                id="categoria"
                              />
                            <div className="invalid-feedback is-invalid">
                              Por favor, seleccione una categoria.
                            </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="fk_id_producto">Producto</label>
                          <Select
                              className="react-select-container form-empt limpiar my-custom-class"
                              classNamePrefix="react-select"
                              options={selectedCategoria && productosCategoria.length > 0 ? productosCategoria.map(element => ({ key: element.id_tipo, value: { id_tipo: element.id_tipo, id_producto: element.id_producto }, label: `${element.nombre_tipo} - ${element.cantidad_peso_producto} ${element.unidad_peso} disponible(s)` })) : [{ value: '', label: 'No hay productos disponibles' }]}
                              placeholder="Selecciona..."
                              onChange={handleTipo}
                              value={selectedOption}
                              id="fk_id_tipo_producto"
                              name="fk_id_tipo_producto"
                          />

                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione un producto.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4"><div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="cantidad_peso_movimiento">Cantidad</label>
                          <input type="number" id="cantidad_peso_movimiento" name="cantidad_peso_movimiento"  className="form-control form-empty limpiar" />
                          <div className="invalid-feedback is-invalid">
                            Por favor, ingrese una cantidad.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline" >
                          <label className="form-label" htmlFor="unidad_peso_movimiento" >Unidad</label><br></br>
                          <input 
                            type="text" 
                            id="unidad_peso_movimiento" 
                            className="form-control form-empty limpiar" 
                            disabled={true} 
                            name="unidad_peso_movimiento" 
                            value={unidadSeleccionada || 'No hay unidad de medida'}
                        />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                    <div className="col">
                          <div data-mdb-input-init className="form-outline">
                              <label className="form-label" htmlFor="destino_movimiento">Destino</label>
                              <select  className="form-select form-empty limpiar" key="destino_movimiento" id="destino_movimiento" name="destino_movimiento" aria-label="Default select example" onChange={handleDestino} value={destinoMovimiento}>
                                  <option value="">Seleccione una opción</option>
                                  <option value="taller">Taller</option>
                                  <option value="produccion">Producción</option>
                                  <option value="evento">Evento</option>
                              </select>
                              <div className="invalid-feedback is-invalid">
                                  Por favor, seleccione un destino.
                              </div>
                          </div>
                      </div>
                      {/* Si el destino es "Taller" o "Evento", mostrar los selectores de instructores y titulados */}
                      {destinoMovimiento === "taller" || destinoMovimiento === "evento" ? (
                          <>
                              <div className="col">
                                  <div data-mdb-input-init className="form-outline">
                                      <label className="form-label" htmlFor="fk_id_titulado">Titulado</label>
                                      <Select
                                        className="react-select-container  form-empt my-custom-class"
                                        classNamePrefix="react-select"
                                        options={tituladoList && tituladoList.length > 0 ? tituladoList.map((element, index) => ({key: index, value: element.id_titulado, label: `${element.nombre_titulado} - ${element.id_ficha}`})) : [{value: "", label: "No hay titulados registrados"}]}
                                        placeholder="Selecciona..."
                                        onChange={handleTitulado}
                                        value={selectedOptionTit}
                                        id="fk_id_titulado"
                                      />
                                      <div className="invalid-feedback is-invalid">
                                          Por favor, seleccione un titulado.
                                      </div>
                                  </div>
                              </div>
                                <div className="col">
                                    <div data-mdb-input-init className="form-outline">
                                        <label className="form-label" htmlFor="fk_id_instructor">Instructor</label>
                                        <Select
                                          className="react-select-container  form-empt my-custom-class"
                                          classNamePrefix="react-select"
                                          options={instructorList && instructorList.length > 0 ? instructorList.map((element, index) => ({key: index, value: element.id, label: element.nombre})) : [{value: "", label: "No hay instructores registrados"}]}
                                          placeholder="Selecciona..."
                                          onChange={handleInstructor}
                                          value={selectedOptionIns}
                                          id="fk_id_instructor"
                                        />
                                        <div className="invalid-feedback is-invalid">
                                            Por favor, seleccione un instructor.
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                      </div>
                      <div className="row mb-4">
                      <div className="col">
                          <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="nota_factura">Descripción</label>
                            <textarea id="nota_factura" name="nota_factura" className="form-control form-empty limpiar"></textarea>

                            <div className="invalid-feedback is-invalid">
                              Por favor, ingrese una descripción válida.
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" className="btn-color btn" onClick={registrarMovimientoSalida}>Registrar</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="movimientoEditarModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg text-white">
                            <h1 className="modal-title fs-5" id="actualizarModalLabel">Editar de movimiento de salida</h1>
                            <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div data-mdb-input-init className="form-outline">
                                            <label className="form-label" htmlFor="cantidad_peso_movimiento">Cantidad</label>
                                            <input type="text" className="form-control form-update limpiar" placeholder="Precio del Producto" value={movimientoSeleccionado.cantidad_peso_movimiento || ''} name="cantidad_peso_movimiento" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, cantidad_peso_movimiento: e.target.value })} />
                                            <div className="invalid-feedback is-invalid">
                                                Por favor, ingrese una cantidad.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col">
                                        <div className="form-outline">
                                            <label className="form-label" htmlFor="destino_movimiento">Destino</label>
                                            <select className="form-select" value={movimientoSeleccionado.destino_movimiento || ''} name="destino_movimiento" onChange={(e) => {setMovimientoSeleccionado({ ...movimientoSeleccionado, destino_movimiento: e.target.value }); handleDestino2(e);}}>

                                                <option value="">Seleccio una opción </option>
                                                <option value="taller">Taller</option>
                                                <option value="evento">Evento</option>
                                                <option value="produccion">Producción</option>
                                            </select>
                                        </div>
                                    </div>
                                    {!isLoading && showInstructorTituladoSelects && (
                                        <>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="fk_id_instructor">Instructor</label>
                                                    <select className="form-select" value={movimientoSeleccionado.fk_id_instructor || ''} key="fk_id_instructor" name="fk_id_instructor" onChange={(e) => {setMovimientoSeleccionado({ ...movimientoSeleccionado, fk_id_instructor: e.target.value }); handleInstructor(e);}}>
                                                      <option>Seleccione una opción</option>
                                                      {instructorList && instructorList.map((instructor, index) => (<option key={index} value={instructor.value}>{instructor.label}</option>
                                                      ))}
                                                    </select>
                                                    <div className="invalid-feedback is-invalid">
                                                        Por favor, seleccione un instructor.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="fk_id_titulado">Titulado</label>
                                                    <select className="form-select" value={movimientoSeleccionado.fk_id_titulado || ''} key="fk_id_titulado" name="fk_id_titulado" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, fk_id_titulado: e.target.value })}>
                                                        <option>Seleccionar titulado</option>
                                                        {tituladoList && tituladoList.map((titulado, index) => (
                                                            <option key={index} value={titulado.value}>{titulado.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="row mb-4">
                                  <div className="col">
                                    <div data-mdb-input-init className="form-outline">
                                      <label className="form-label" htmlFor="nota_factura">Descripción</label>
                                      <textarea className="form-control form-update limpiar" placeholder="Nota" value={movimientoSeleccionado.nota_factura || ''}name="nota_factura" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, nota_factura: e.target.value })} />
                                      <div className="invalid-feedback is-invalid">
                                        Por favor, ingrese una nota mas larga.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-color" onClick={() => actualizarMovimiento(movimientoSeleccionado.id_factura)}>Actualizar</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

    </>
  );
};

export default Movimiento;