import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmprendimientoList from "./components/emprendimientolist";
import Emprendimiento from "./components/emprendimiento";
import "./estilos.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<EmprendimientoList />} />
          <Route path="/emprendimientos/:id" element={<Emprendimiento />} />
          <Route path="*" element={<EmprendimientoList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}