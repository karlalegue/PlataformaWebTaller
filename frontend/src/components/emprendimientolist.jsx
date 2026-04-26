<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmprendimientos, getCategorias } from "../services/api";
import "./emprendimientolist.css";

export default function EmprendimientoList() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [cargando, setCargando] = useState(true);
=======

import { useEffect, useState } from "react"; /*guarda datos en el componente*/
import { Link } from "react-router-dom";
import { getEmprendimientos } from "../services/api"; /*peticion http al backend --> lista de emprendimiento*/
import "./emprendimientolist.css";

export default function EmprendimientoList() { 
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
  const [error, setError] = useState(null);


  useEffect(() => {
<<<<<<< HEAD
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
=======
    getEmprendimientos()
      .then((data) => setEmprendimientos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return (
      <div className="status-container">
        <p className="status-msg">Cargando emprendimientos</p>
>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
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

<<<<<<< HEAD
=======

>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
  return (
    <div className="negocios-page">
      <header className="page-header">
        <h1>Emprendimientos de Valle Simpson</h1>
        <p className="subtitle">
          Descubre el comercio local. Selecciona un emprendimiento para ver su información completa.
        </p>
      </header>

<<<<<<< HEAD
      
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
=======
      {emprendimientos.length === 0 ? (
        <p className="status-msg">No hay emprendimientos registrados aún.</p>
>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
      ) : (
        <ul className="emprendimientos-list">
          {emprendimientos.map((emprendimiento) => (
            <li key={emprendimiento.id} className="negocio-card">
<<<<<<< HEAD
=======
            
>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
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
