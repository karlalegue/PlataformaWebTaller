
import { BrowserRouter, Routes, Route } from "react-router-dom";
import emprendimientolist from "./components/emprendimientolist";
import emprendimiento from "./components/emprendimiento";
import "./estilos.css";

export default function estilos() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>

          <Route path="/" element={<emprendimientolist />} />

  
          <Route path="/emprendimientos/:id" element={<emprendimiento />} />

        
          <Route path="*" element={<emprendimientolist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
