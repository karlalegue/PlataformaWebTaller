import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorAuth } from "./context/AuthContext";
import EmprendimientoList from "./components/emprendimientolist";
import Emprendimiento from "./components/emprendimiento";
import Login from "./components/Login";
import PanelAdmin from "./components/PanelAdmin";
import RutaProtegida from "./components/Ruta";
import "./estilos.css";

export default function App() {
  return (
    <ProveedorAuth>
      <BrowserRouter>
        <div className="app-wrapper">
          <Routes>
            <Route path="/" element={<EmprendimientoList />} />
            <Route path="/emprendimientos/:id" element={<Emprendimiento />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <RutaProtegida>
                <PanelAdmin />
              </RutaProtegida>
            } />
            <Route path="*" element={<EmprendimientoList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProveedorAuth>
  );
}
