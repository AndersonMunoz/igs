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
    <div className="dashboard-container">
      {loading ? (
        <div className="loading-spinner">
          <ProgressSpinner strokeWidth={4} className="custom-spinner" />
        </div>
      ) : (
        <div className="grid-container">
          <div className="container-wrapper">
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
            <div className="small-container">
              <p>Contenedor 5 </p>
            </div>
          </div>
          <div className="container-wrapper">
            <div className="grafi-container">
              <p>Contenedor 6</p>
            </div>
            <div className="grafi-container">
              <p>Contenedor 7</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
