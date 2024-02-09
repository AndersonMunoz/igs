import React, { useEffect, useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Password } from "primereact/password";
// import { Chart } from 'primereact/chart';
import "../style/dashboardContent.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  });

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
        <div>
          <h1>Sala de Actividad</h1>
          <div className="grid">
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Orders</span>
                    <div className="text-900 font-medium text-xl">152</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">24 new </span>
            <span className="text-500">since last visit</span>
        </div>
    </div>
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Revenue</span>
                    <div className="text-900 font-medium text-xl">$2.100</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Customers</span>
                    <div className="text-900 font-medium text-xl">28441</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">520  </span>
            <span className="text-500">newly registered</span>
        </div>
    </div>
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Comments</span>
                    <div className="text-900 font-medium text-xl">152 Unread</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-comment text-purple-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">85 </span>
            <span className="text-500">responded</span>
        </div>
    </div>
</div>

          <div className="card bg-dark text-center p-4">
            <label htmlFor="password" className="label-bold text-white">Contraseña</label>
            <Password value={value} onChange={(e) => setValue(e.target.value)}
                promptLabel="Contraseña" weakLabel="Simple" mediumLabel="Mediana" strongLabel="Completa"
                className="p-password-custom" inputClassName="form-control form-empty limpiar" toggleMask/>
        </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
