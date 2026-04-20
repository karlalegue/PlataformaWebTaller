
import { useEffect, useState } from "react"; /*guarda datos en el componente*/
import { Link } from "react-router-dom";
import { getEmprendimientos } from "../services/api"; /*peticion http al backend --> lista de emprendimiento*/
import "./emprendimientolist.css";

export default function EmprendimientoList() { 
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    getEmprendimientos()
      .then((data) => setEmprendimientos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return (
      <div className="status-container">
        <p className="status-msg">Cargando emprendimientos</p>
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

      {emprendimientos.length === 0 ? (
        <p className="status-msg">No hay emprendimientos registrados aún.</p>
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
