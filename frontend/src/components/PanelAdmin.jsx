import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEmprendimientos, getCategorias } from "../services/api";
import "./PanelAdmin.css";

const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const VACIO = {
  nombre_emprendimiento: "",
  categoria_emprendimiento: "",
  horario: "",
  telefono: "",
  redes_sociales: "",
  direccion: "",
  latitud: "",
  longitud: "",
};

export default function PanelAdmin() {
  const { cerrarSesion } = useAuth();
  const navegar = useNavigate();

  const [emprendimientos, setEmprendimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formulario, setFormulario] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const [emps, cats] = await Promise.all([getEmprendimientos(), getCategorias()]);
    setEmprendimientos(emps);
    setCategorias(cats);
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  function abrirCrear() {
    setFormulario(VACIO);
    setEditandoId(null);
    setMostrarFormulario(true);
    setError(null);
  }

  function abrirEditar(emp) {
    setFormulario({
      nombre_emprendimiento: emp.nombre_emprendimiento,
      categoria_emprendimiento: emp.categoria_emprendimiento,
      horario: emp.horario ?? "",
      telefono: emp.telefono ?? "",
      redes_sociales: emp.redes_sociales ?? "",
      direccion: emp.direccion ?? "",
      latitud: emp.latitud ?? "",
      longitud: emp.longitud ?? "",
    });
    setEditandoId(emp.id);
    setMostrarFormulario(true);
    setError(null);
  }

  function cancelar() {
    setMostrarFormulario(false);
    setEditandoId(null);
    setFormulario(VACIO);
    setError(null);
  }

  async function manejarGuardar() {
    setError(null);
    if (!formulario.nombre_emprendimiento || !formulario.categoria_emprendimiento) {
      setError("El nombre y la categoría son obligatorios.");
      return;
    }
    const cuerpo = {
      ...formulario,
      latitud: formulario.latitud !== "" ? parseFloat(formulario.latitud) : null,
      longitud: formulario.longitud !== "" ? parseFloat(formulario.longitud) : null,
    };
    const url = editandoId
      ? `${URL_BASE}/emprendimientos/${editandoId}`
      : `${URL_BASE}/emprendimientos/`;
    const metodo = editandoId ? "PUT" : "POST";
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    if (!respuesta.ok) {
      const err = await respuesta.json();
      setError(err.detail ?? "Error al guardar.");
      return;
    }
    setExito(editandoId ? "Emprendimiento actualizado." : "Emprendimiento creado.");
    setTimeout(() => setExito(null), 3000);
    cancelar();
    cargarDatos();
  }

  async function manejarEliminar(id, nombre) {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    const respuesta = await fetch(`${URL_BASE}/emprendimientos/${id}`, { method: "DELETE" });
    if (!respuesta.ok) {
      setError("No se pudo eliminar.");
      return;
    }
    setExito("Emprendimiento eliminado.");
    setTimeout(() => setExito(null), 3000);
    cargarDatos();
  }

  function salir() {
    cerrarSesion();
    navegar("/admin/login");
  }

  return (
    <div className="panel-wrapper">
      <header className="panel-header">
        <h1 className="panel-titulo">Panel de administración — Valle Simpson</h1>
        <button className="btn-salir" onClick={salir}>Cerrar sesión</button>
      </header>

      <div className="panel-cuerpo">
        {exito && <p className="panel-exito">{exito}</p>}

        <div className="panel-acciones">
          <h2 className="panel-subtitulo">Emprendimientos ({emprendimientos.length})</h2>
          <button className="btn-primary" onClick={abrirCrear}>Agregar</button>
        </div>

        {mostrarFormulario && (
          <div className="formulario-card">
            <h3 className="formulario-titulo">
              {editandoId ? "Editar emprendimiento" : "Nuevo emprendimiento"}
            </h3>

            {error && <p className="panel-error">{error}</p>}

            <div className="formulario-grid">
              <div className="campo">
                <label>Nombre *</label>
                <input name="nombre_emprendimiento" value={formulario.nombre_emprendimiento} onChange={manejarCambio} />
              </div>
              <div className="campo">
                <label>Categoría *</label>
                <select name="categoria_emprendimiento" value={formulario.categoria_emprendimiento} onChange={manejarCambio}>
                  <option value="">Seleccionar</option>
                  {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="campo">
                <label>Horario</label>
                <input name="horario" value={formulario.horario} onChange={manejarCambio} />
              </div>
              <div className="campo">
                <label>Teléfono</label>
                <input name="telefono" value={formulario.telefono} onChange={manejarCambio} />
              </div>
              <div className="campo">
                <label>Redes sociales</label>
                <input name="redes_sociales" value={formulario.redes_sociales} onChange={manejarCambio} />
              </div>
              <div className="campo">
                <label>Dirección</label>
                <input name="direccion" value={formulario.direccion} onChange={manejarCambio} />
              </div>
              <div className="campo">
                <label>Latitud</label>
                <input name="latitud" type="number" step="any" value={formulario.latitud} onChange={manejarCambio} />
              </div>
              <div className="campo">
                <label>Longitud</label>
                <input name="longitud" type="number" step="any" value={formulario.longitud} onChange={manejarCambio} />
              </div>
            </div>

            <div className="formulario-botones">
              <button className="btn-primary" onClick={manejarGuardar}>
                {editandoId ? "Guardar cambios" : "Crear"}
              </button>
              <button className="btn-secundario" onClick={cancelar}>Cancelar</button>
            </div>
          </div>
        )}

        <table className="panel-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {emprendimientos.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.nombre_emprendimiento}</td>
                <td>{emp.categoria_emprendimiento}</td>
                <td className="td-acciones">
                  <button className="btn-editar" onClick={() => abrirEditar(emp)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => manejarEliminar(emp.id, emp.nombre_emprendimiento)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
