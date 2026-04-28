import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesionAdmin } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const { iniciarSesion } = useAuth();
    const navegar = useNavigate();

    async function manejarEnvio(evento) {
    evento.preventDefault();
    setError(null);
    setCargando(true);

    try {
    await iniciarSesionAdmin(nombreUsuario, contrasena);
    iniciarSesion();
    navegar("/admin");
    } catch (err) {
    setError(err.message);
    } finally {
    setCargando(false);
    }
    }

return (
    <div className="login-page">
    <div className="login-card">
        <h1 className="login-titulo">Acceso administrador</h1>
        <p className="login-subtitulo">Valle Simpson</p>

        <form onSubmit={manejarEnvio} className="login-form">
        <div className="login-field">
            <label htmlFor="nombreUsuario">Usuario</label>
            <input
            id="nombreUsuario"
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            placeholder="Nombre de usuario"
            required
            />
        </div>

        <div className="login-field">
            <label htmlFor="contrasena">Contraseña</label>
            <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Contraseña"
            required
            />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={cargando} className="login-btn">
            {cargando ? "Ingresando..." : "Ingresar"}
        </button>
        </form>
    </div>
    </div>
);
}