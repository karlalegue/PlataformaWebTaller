import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children }) {
  const { estaAutenticado } = useAuth();
  if (!estaAutenticado) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
