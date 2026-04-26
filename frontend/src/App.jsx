import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { ProveedorAuth } from "./context/AuthContext";
import EmprendimientoList from "./components/emprendimientolist";
import Emprendimiento from "./components/emprendimiento";
import Login from "./components/Login";
=======
import EmprendimientoList from "./components/emprendimientolist";
import Emprendimiento from "./components/emprendimiento";
>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
import "./estilos.css";

export default function App() {
  return (
<<<<<<< HEAD

    <ProveedorAuth>
      <BrowserRouter>
        <div className="app-wrapper">
          <Routes>
            <Route path="/" element={<EmprendimientoList />} />
            <Route path="/emprendimientos/:id" element={<Emprendimiento />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="*" element={<EmprendimientoList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProveedorAuth>
  );
}
=======
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
>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
