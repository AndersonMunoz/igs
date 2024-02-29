import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../style/Style.css";

const App = () => {
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleAddCategory = () => {
    if (categoryInput.trim() !== "") {
      setCategories([...categories, categoryInput]);
      setCategoryInput("");
    }
  };

  useEffect(() => {
    listaCat();
  }, []);

  function listaCat() {
    fetch("http://localhost:3000/categoria/listar", {
      method: "get",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories("");
        if (data) {
          const categoryNames = Object.keys(data)
            .filter((key) => data[key].estado !== 0)
            .map((key) => data[key].nombre_categoria);

          setCategories((prevCategories) => [
            ...prevCategories,
            ...categoryNames,
          ]);
        } else {
          console.log("no hay datos");
        }
      });
  }

  const newLink = (category) => {
    navigate(`/inventario/item`);
    console.log(category);
    localStorage.setItem("category", category);
  };

  const renderCategories = () => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 2) {
      rows.push(
        <div className="row mt-4" key={i}>
          {categories.slice(i, i + 2).map((category, index) => (
            <div key={index} className="col">
              <button
                onClick={() => newLink(category)}
                className="rounded btn-white w-100 border-color text-md"
              >
                <h2>{category}</h2>
              </button>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="container rounded p-4 mt-4">
      <div className="rounded p-1 mb-4 txt-color">
        <h1 className="text-center">INVENTARIO</h1>
      </div>
      <div className="container mt-4">
        <div className="row w-100" style={{ justifyContent: "flex-end" }}>
          <div className="form-group col-6">
            <input
              type="text"
              className="form-control border-color h-100"
              placeholder="Buscar categoría"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
          </div>
          <div className="form-group col-3">
            <button
              className="btn-color rounded h-100 w-100"
              type="button"
              onClick={handleAddCategory}
            >
              <h3 className="mt-1">Buscar</h3>
            </button>
          </div>
        </div>
      </div>

      {renderCategories()}

      <div className="d-grid gap-2 col-3 mx-auto mt-4">
        <div className="row">
          <div className="col text-center">
            <button className="btn btn-primary mb-2 w-100">Kardes</button>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <button className="btn btn-danger w-100">
              Productos a caducar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const newLink = App.newLink; // Exporta la función newLink

export default App;
