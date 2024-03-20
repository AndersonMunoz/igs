import React from "react";
import PdfManual1 from "/Manual_técnico_IGS.pdf"


const Ayuda = () => {





    return (

        <>
            <h3 className="text-center mt-3">Ayuda</h3>
            <h5 className="mb-2">Manual de usuario administrador</h5>
            <a href={PdfManual1} target="_blank">Manual de usuario</a>
            <h5 className="mt-2 mb-4">Manual de usuario coadministrador</h5>
            <h5 className="mb-4">Manual Tecnico</h5>

        </>



    )

}

export default Ayuda;