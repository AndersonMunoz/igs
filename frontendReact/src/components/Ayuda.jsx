import React from "react";
import PdfManual1 from "/Manual_técnico_IGS.pdf"


const Ayuda = () => {





    return (

        <>
            <h2 className="text-center mt-3">Ayuda</h2>
            <h4 className="sssssss">Guias de ayuda</h4>
            <h5 className="mb-2">Manual de usuario administrador</h5>
            <button className="btn btn-color">
                <a className="dsdsd" href={PdfManual1} target="_blank">Manual de usuario</a>
            </button>
            
            <h5 className="mt-2 mb-4">Manual de usuario coadministrador</h5>
            <h5 className="mb-4">Manual Tecnico</h5>

        </>



    )

}

export default Ayuda;