import React, { useEffect, useRef, useState } from "react";


const Dashboard= () => {

  
  return (
<div>
      <h1>Sala de Actividad</h1>
      <div className="row gap-4">
        <div className="col-2 bg-primary p-3">
          <h1 className="text-center">Sala de Actividad</h1>
        </div>
        <div className="col-2 bg-success p-3">
          <h1 className="text-center">Container One</h1>
        </div>
        <div className="col-2 bg-warning p-3">
          <h1 className="text-center">Container Two</h1>
        </div>
        <div className="col-2 bg-info p-3">
          <h1 className="text-center">Container Three</h1>
        </div>
        <div className="col-3 bg-info p-3">
          <h1 className="text-center">Container FOur</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;