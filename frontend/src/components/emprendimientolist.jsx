import { useEffect, useState, useRef } from "react";
import { useNavigate }                  from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L                                from "leaflet";
import "leaflet/dist/leaflet.css";
import { getEmprendimientos, getCategorias } from "../services/api";
import "./emprendimientolist.css";


import iconUrl       from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl     from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });


const iconoResaltado = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
        <path fill="#d4891a" stroke="#9a5e08" stroke-width="1.5"
          d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26S28 23.333 28 14C28 6.268 21.732 0 14 0z"/>
        <circle cx="14" cy="14" r="6" fill="white"/>
      </svg>
    `),
  iconSize:    [28, 40],
  iconAnchor:  [14, 40],
  popupAnchor: [0, -42],
});

// Icono normal verde personalizado
const iconoVerde = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34">
        <path fill="#1a3c2e" stroke="#0d2b1e" stroke-width="1.2"
          d="M12 0C5.373 0 0 5.373 0 12c0 8 12 22 12 22S24 20 24 12C24 5.373 18.627 0 12 0z"/>
        <circle cx="12" cy="12" r="5" fill="rgba(255,255,255,0.9)"/>
      </svg>
    `),
  iconSize:    [24, 34],
  iconAnchor:  [12, 34],
  popupAnchor: [0, -36],
});

// ── Componente auxiliar: centra el mapa cuando cambian los datos ──────────
function AjustarVista({ emprendimientos }) {
  const map = useMap();

  useEffect(() => {
    const conCoordenadas = emprendimientos.filter(
      (e) => e.latitud && e.longitud
    );
    if (conCoordenadas.length === 0) return;

    if (conCoordenadas.length === 1) {
      map.setView([conCoordenadas[0].latitud, conCoordenadas[0].longitud], 15);
      return;
    }

    const bounds = L.latLngBounds(
      conCoordenadas.map((e) => [e.latitud, e.longitud])
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [emprendimientos, map]);

  return null;
}

// ── Componente principal ─────────────────────────────────────────────────
export default function EmprendimientoList() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [categorias, setCategorias]           = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [seleccionado, setSeleccionado]       = useState(null); // id del pin activo
  const [cargando, setCargando]               = useState(true);
  const [error, setError]                     = useState(null);
  const [panelAbierto, setPanelAbierto]       = useState(true);
  const navigate = useNavigate();
  const itemRefs = useRef({});

  // ── Centro por defecto: Valle Simpson, Aysén ────────────────────────────
  const centroDefault = [-45.55, -72.05];

  useEffect(() => {
    getCategorias()
      .then((d) => setCategorias(d))
      .catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    setCargando(true);
    setError(null);
    setSeleccionado(null);
    getEmprendimientos(categoriaActiva || null)
      .then((d) => setEmprendimientos(d))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [categoriaActiva]);

  
  useEffect(() => {
    if (seleccionado !== null && itemRefs.current[seleccionado]) {
      itemRefs.current[seleccionado].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [seleccionado]);

  const conCoordenadas = emprendimientos.filter((e) => e.latitud && e.longitud);

  return (
    <div className="pagina-mapa">

      {/* ── BARRA SUPERIOR ─────────────────────────────────────── */}
      <header className="barra-superior">
        <div className="barra-marca">
          <span className="barra-etiqueta">Región de Aysén · Chile</span>
          <h1 className="barra-titulo">Valle Simpson</h1>
        </div>

        {/* Filtro de categorías */}
        {categorias.length > 0 && (
          <div className="barra-filtro">
            <label className="filtro-label" htmlFor="filtro">
              Categoría
            </label>
            <select
              id="filtro"
              className="filtro-select"
              value={categoriaActiva}
              onChange={(e) => setCategoriaActiva(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        {/* Botón mostrar/ocultar panel */}
        <button
          className="btn-toggle-panel"
          onClick={() => setPanelAbierto((v) => !v)}
          aria-label={panelAbierto ? "Ocultar listado" : "Mostrar listado"}
        >
          {panelAbierto ? "Ocultar lista" : "Ver lista"}
        </button>
      </header>

      {/* ── CONTENIDO PRINCIPAL ────────────────────────────────── */}
      <div className="contenido-mapa">

        {/* ── PANEL LATERAL ────────────────────────────────────── */}
        <aside className={`panel-lateral ${panelAbierto ? "abierto" : "cerrado"}`}>
          <div className="panel-cabecera">
            <span className="panel-conteo">
              {cargando
                ? "Cargando..."
                : `${emprendimientos.length} ${emprendimientos.length === 1 ? "lugar" : "lugares"}`}
            </span>
          </div>

          {/* Skeleton */}
          {cargando && (
            <div className="skeleton-lista">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-tarjeta" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="panel-error">{error}</p>
          )}

          {/* Lista */}
          {!cargando && !error && (
            <ul className="panel-lista">
              {emprendimientos.length === 0 ? (
                <li className="panel-vacio">
                  No hay emprendimientos en esta categoría.
                </li>
              ) : (
                emprendimientos.map((emp) => (
                  <li
                    key={emp.id}
                    ref={(el) => (itemRefs.current[emp.id] = el)}
                    className={`panel-item ${seleccionado === emp.id ? "activo" : ""}`}
                    onClick={() => {
                      setSeleccionado(emp.id === seleccionado ? null : emp.id);
                    }}
                    onDoubleClick={() => navigate(`/emprendimientos/${emp.id}`)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(`/emprendimientos/${emp.id}`);
                    }}
                    role="button"
                    aria-label={`Ver ${emp.nombre_emprendimiento}`}
                  >
                    <div className="item-info">
                      <span className="item-nombre">
                        {emp.nombre_emprendimiento}
                      </span>
                      <span className="item-categoria">
                        {emp.categoria_emprendimiento}
                      </span>
                    </div>
                    <span className="item-flecha">›</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </aside>

        {/* ── MAPA ─────────────────────────────────────────────── */}
        <div className="mapa-principal">
          <MapContainer
            center={centroDefault}
            zoom={13}
            className="leaflet-mapa"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <AjustarVista emprendimientos={conCoordenadas} />

            {conCoordenadas.map((emp) => (
              <Marker
                key={emp.id}
                position={[emp.latitud, emp.longitud]}
                icon={seleccionado === emp.id ? iconoResaltado : iconoVerde}
                eventHandlers={{
                  click: () => setSeleccionado(emp.id === seleccionado ? null : emp.id),
                }}
              >
                <Popup>
                  <div className="popup-contenido">
                    <strong className="popup-nombre">
                      {emp.nombre_emprendimiento}
                    </strong>
                    <span className="popup-categoria">
                      {emp.categoria_emprendimiento}
                    </span>
                    <button
                      className="popup-btn"
                      onClick={() => navigate(`/emprendimientos/${emp.id}`)}
                    >
                      Ver ficha completa
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {}
          {!cargando && emprendimientos.length > conCoordenadas.length && (
            <div className="mapa-aviso">
              {emprendimientos.length - conCoordenadas.length} sin ubicación registrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
}