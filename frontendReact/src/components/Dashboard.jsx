import React, { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import "../style/dashboardContent.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {loading ? (
        <div
          className="text-center"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ProgressSpinner strokeWidth={4} className="custom-spinner" />
        </div>
      ) : (
        <div className="contenedor">
          <div className="content-container">
             <div className="small-container">
            <p>Contenedor 1</p>
          </div>
          <div className="small-container">
            <p>Contenedor 2</p>
          </div>
          <div className="small-container">
            <p>Contenedor 3</p>
          </div>
          <div className="small-container">
            <p>Contenedor 4</p>
          </div>
          </div>
          <div>
          <div className="large-container">
            <p>Contenedor 5 - Más largo verticalmente</p>
          </div>
          </div>
         
        </div>
      )}
    </div>
  );
};

export default Dashboard;
