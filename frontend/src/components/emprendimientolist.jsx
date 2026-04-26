import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmprendimientos, getCategorias } from "../services/api";
import "./emprendimientolist.css";

export default function EmprendimientoList() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    getCategorias()
      .then((datos) => setCategorias(datos))
      .catch(() => setCategorias([]));
  }, []);


  useEffect(() => {
    setCargando(true);
    setError(null);
    getEmprendimientos(categoriaActiva || null)
      .then((datos) => setEmprendimientos(datos))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [categoriaActiva]);

  if (cargando) {
    return (
      <div className="status-container">
        <p className="status-msg">Cargando emprendimientos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container">
        <p className="status-msg error">{error}</p>
      </div>
    );
  }

  return (
    <div className="negocios-page">
      <header className="page-header">
        <h1>Emprendimientos de Valle Simpson</h1>
        <p className="subtitle">
          Descubre el comercio local. Selecciona un emprendimiento para ver su información completa.
        </p>
      </header>

      
      {categorias.length > 0 && (
        <div className="filtro-container">
          <select
            className="filtro-select"
            value={categoriaActiva}
            onChange={(e) => setCategoriaActiva(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>
      )}

      {emprendimientos.length === 0 ? (
        <p className="status-msg">No hay emprendimientos en esta categoría.</p>
      ) : (
        <ul className="emprendimientos-list">
          {emprendimientos.map((emprendimiento) => (
            <li key={emprendimiento.id} className="negocio-card">
              <Link to={`/emprendimientos/${emprendimiento.id}`} className="emprendimiento-link">
                <span className="emprendimiento-nombre">{emprendimiento.nombre_emprendimiento}</span>
                <span className="emprendimiento-categoria">{emprendimiento.categoria_emprendimiento}</span>
                <span className="emprendimiento-arrow">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
