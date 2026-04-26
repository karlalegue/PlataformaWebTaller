
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEmprendimiento } from "../services/api";
import "./emprendimiento.css";

export default function Emprendimiento() {
  
  const { id } = useParams();

  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    setLoading(true);
    setError(null);

    getEmprendimiento(id)
      .then((data) => setEmprendimiento(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

 
  if (loading) {
    return (
      <div className="status-container">
        <p className="status-msg">Cargando información</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container">
        <p className="status-msg error">{error}</p>
        <Link to="/" className="btn-volver">← Volver al listado</Link>
      </div>
    );
  }


  return (
    <div className="detalle-page">
      <Link to="/" className="btn-volver">← Volver al listado</Link>

      <div className="detalle-card">
        <header className="detalle-header">
          <h1 className="detalle-nombre">{emprendimiento.nombre_emprendimiento}</h1>
          <span className="detalle-categoria">{emprendimiento.categoria_emprendimiento}</span>
        </header>

        <section className="detalle-info">
          
          {emprendimiento.horario && (
            <InfoRow etiqueta="Horario" valor={emprendimiento.horario} />
          )}
          {emprendimiento.direccion && (
            <InfoRow etiqueta="Dirección" valor={emprendimiento.direccion} />
          )}
          {emprendimiento.telefono && (
            <InfoRow etiqueta="Teléfono" valor={emprendimiento.telefono} />
          )}
          {emprendimiento.redes_sociales && (
            <InfoRow etiqueta="Redes sociales" valor={emprendimiento.redes_sociales} />
          )}
        </section>
      </div>
    </div>
  );
}


function InfoRow({etiqueta, valor}) {
  return (
    <div className="info-row">
      <div className="info-texto">
        <span className="info-etiqueta">{etiqueta}</span>
        <span className="info-valor">{valor}</span>
      </div>
    </div>
  );
}
