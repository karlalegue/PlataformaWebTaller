import { createContext, useContext, useState } from "react";

const ContextoAuth = createContext(null);

export function ProveedorAuth({ children }) {
  const [estaAutenticado, setEstaAutenticado] = useState(
    sessionStorage.getItem("admin_autenticado") === "true"
  );

  const iniciarSesion = () => {
    sessionStorage.setItem("admin_autenticado", "true");
    setEstaAutenticado(true);
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("admin_autenticado");
    setEstaAutenticado(false);
  };

  return (
    <ContextoAuth.Provider value={{ estaAutenticado, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAuth.Provider>
  );
}

export function useAuth() {
  return useContext(ContextoAuth);
}