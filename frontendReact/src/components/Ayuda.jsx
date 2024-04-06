import React, { useEffect, useState } from "react";
import PdfManualTecnico from "/Manual_técnico_IGS.pdf"
import PdfManualUsuarioAdmin from "/Manual_de_Usuario_Administrador_IGS.pdf"
import PdfManualUsuarioCoadmin from "/Manual_de_Usuario_Co-administrador_IGS.pdf"
import { dataDecript } from "./encryp/decryp";


const Ayuda = () => {

    const [userRoll, setUserRoll] = useState("");


    useEffect(() => {

        setUserRoll(dataDecript(localStorage.getItem("roll")));

    }, []);
    return (

        <>
            <h2 className="text-center mt-3">Ayuda</h2>
            <h4 className="sssssss mb-4">Guias de ayuda</h4>

            {userRoll === "administrador" ? (
                <>
                    <h5 className="mb-2">Manual de usuario administrador</h5>
                    <button className="btn btn-color mb-4">
                        <a className="dsdsd" href={PdfManualUsuarioAdmin} target="_blank">Ver manual de usuario</a>
                    </button>
                    <h5 className="mb-2">Manual Tecnico Instalacion</h5>
                    <button className="btn btn-color">
                        <a className="dsdsd" href={PdfManualTecnico} target="_blank">Ver manual tecnico</a>
                    </button>
                </>

            ) : (
                <>
                    <h5 className="mb-2">Manual de usuario Co-Administrador</h5>
                    <button className="btn btn-color mb-4">
                        <a className="dsdsd" href={PdfManualUsuarioCoadmin} target="_blank">Ver manual de usuario</a>
                    </button>
{/*                     <h5 className="mb-2">Manual Tecnico Instalacion</h5>
                    <button className="btn btn-color">
                        <a className="dsdsd" href={PdfManualTecnico} target="_blank">Ver manual tecnico</a>
                    </button> */}
                </>

            )}

        </>
    );
}

export default Ayuda;