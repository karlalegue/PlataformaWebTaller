import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmprendimientos, getCategorias } from "../services/api";
import "./emprendimientolist.css";




export default function EmprendimientoList() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [categorias, setCategorias]           = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [cargando, setCargando]               = useState(true);
  const [error, setError]                     = useState(null);


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

  return (
    <>
    
      <section className="hero">
        <div className="hero-contenido">
          <span className="hero-etiqueta">Región de Aysén · Chile</span>
          <h1 className="hero-titulo">Valle Simpson</h1>
          <p className="hero-subtitulo">
            Descubre el comercio y los emprendimientos locales de nuestra comunidad
          </p>
        </div>
      </section>

    
      <main className="listado-seccion">

    
        {categorias.length > 0 && (
          <div className="filtro-contenedor">
            <label className="filtro-label" htmlFor="filtro">
              Filtrar por categoría
            </label>
            <select
              id="filtro"
              className="filtro-select"
              value={categoriaActiva}
              onChange={(e) => setCategoriaActiva(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        {!cargando && !error && (
          <div className="seccion-cabecera">
            <h2 className="seccion-titulo">
              {categoriaActiva ? categoriaActiva : "Todos los emprendimientos"}
            </h2>
            <span className="seccion-conteo">
              {emprendimientos.length} {emprendimientos.length === 1 ? "resultado" : "resultados"}
            </span>
          </div>
        )}

        {cargando && (
          <div className="estado-contenedor">
            <p className="estado-mensaje">Cargando emprendimientos...</p>
          </div>
        )}

        {error && (
          <div className="estado-contenedor">
            <p className="estado-mensaje error"> {error}</p>
          </div>
        )}

        {!cargando && !error && (
          emprendimientos.length === 0 ? (
            <p className="lista-vacia">No hay emprendimientos en esta categoría.</p>
          ) : (
            <ul className="emprendimientos-lista">
              {emprendimientos.map((emp) => (
                <li key={emp.id} className="tarjeta">
                  <Link to={`/emprendimientos/${emp.id}`} className="tarjeta-enlace">
                    <div className="tarjeta-icono">
                      {iconoCategoria(emp.categoria_emprendimiento)}
                    </div>
                    <div className="tarjeta-info">
                      <div className="tarjeta-nombre">{emp.nombre_emprendimiento}</div>
                      <span className="tarjeta-categoria">{emp.categoria_emprendimiento}</span>
                    </div>
                    <span className="tarjeta-flecha">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )
        )}
      </main>
    </>
  );
}