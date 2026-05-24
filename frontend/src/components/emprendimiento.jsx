import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEmprendimiento } from "../services/api";
import "./emprendimiento.css";
import MapaEmprendimiento from "./MapaEmprendimiento";


function estaAbierto(horario) {
  if (!horario) return null;

  const ahora = new Date();
  const diaSemana = ahora.getDay(); 
  const horaActual = ahora.getHours() * 60 + ahora.getMinutes();


  const horasMatch = horario.match(/(\d{1,2})[:\.](\d{2})\s*[-–a]\s*(\d{1,2})[:\.](\d{2})/);
  if (!horasMatch) return null;

  const apertura = parseInt(horasMatch[1]) * 60 + parseInt(horasMatch[2]);
  const cierre   = parseInt(horasMatch[3]) * 60 + parseInt(horasMatch[4]);

  const textoLower = horario.toLowerCase();
  const mapaDias = {
    lun: 1, mar: 2, mié: 3, mie: 3, jue: 4, vie: 5, sáb: 6, sab: 6, dom: 0,
    lunes: 1, martes: 2, "miércoles": 3, miercoles: 3, jueves: 4,
    viernes: 5, sábado: 6, sabado: 6, domingo: 0,
  };

  
  const diasMencionados = Object.entries(mapaDias)
    .filter(([nombre]) => textoLower.includes(nombre))
    .map(([, num]) => num);

  let diaValido = true;

  if (diasMencionados.length >= 2) {
    
    const diaInicio = diasMencionados[0];
    const diaFin    = diasMencionados[diasMencionados.length - 1];

    if (diaInicio <= diaFin) {
      diaValido = diaSemana >= diaInicio && diaSemana <= diaFin;
    } else {
     
      diaValido = diaSemana >= diaInicio || diaSemana <= diaFin;
    }
  } else if (diasMencionados.length === 1) {
    diaValido = diaSemana === diasMencionados[0];
  }
 

  if (!diaValido) return false;
  return horaActual >= apertura && horaActual < cierre;
}

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
        <div className="skeleton-detalle">
          <div className="skeleton-header-block"></div>
          <div className="skeleton-body">
            <div className="skeleton-line largo"></div>
            <div className="skeleton-line medio"></div>
            <div className="skeleton-line corto"></div>
          </div>
        </div>
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

  const estadoAbierto = estaAbierto(emprendimiento.horario);

  return (
    <div className="detalle-page">
      <Link to="/" className="btn-volver">← Volver al listado</Link>

      <div className="detalle-card">
        <header className="detalle-header">
          <div className="detalle-header-texto">
            <h1 className="detalle-nombre">{emprendimiento.nombre_emprendimiento}</h1>
            <span className="detalle-categoria">{emprendimiento.categoria_emprendimiento}</span>
          </div>
          {estadoAbierto !== null && (
            <span className={`badge-estado ${estadoAbierto ? "abierto" : "cerrado"}`}>
              {estadoAbierto ? "Abierto ahora" : "Cerrado ahora"}
            </span>
          )}
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

        {/* Botones de acción rápida */}
        <div className="acciones-rapidas">
          {emprendimiento.telefono && (
            <a
              href={`tel:${emprendimiento.telefono.replace(/\s/g, "")}`}
              className="accion-btn accion-llamar"
            >
              Llamar
            </a>
          )}
          {emprendimiento.latitud && emprendimiento.longitud && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${emprendimiento.latitud},${emprendimiento.longitud}`}
              target="_blank"
              rel="noopener noreferrer"
              className="accion-btn accion-mapa"
            >
              Cómo llegar
            </a>
          )}
        </div>

        <MapaEmprendimiento
          nombre={emprendimiento.nombre_emprendimiento}
          latitud={emprendimiento.latitud}
          longitud={emprendimiento.longitud}
        />
      </div>
    </div>
  );
}

function InfoRow({ etiqueta, valor }) {
  return (
    <div className="info-row">
      <div className="info-texto">
        <span className="info-etiqueta">{etiqueta}</span>
        <span className="info-valor">{valor}</span>
      </div>
    </div>
  );
}
