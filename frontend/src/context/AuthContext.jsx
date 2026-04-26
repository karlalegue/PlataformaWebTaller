
import { createContext, useContext, useState } from "react";

const ContextoAuth = createContext(null);

export function ProveedorAuth({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token_admin") || null);

  const iniciarSesion = (nuevoToken) => {
    localStorage.setItem("token_admin", nuevoToken);
    setToken(nuevoToken);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token_admin");
    setToken(null);
  };

  return (
    <ContextoAuth.Provider value={{ token, iniciarSesion, cerrarSesion, estaAutenticado: !!token }}>
      {children}
    </ContextoAuth.Provider>
  );
}

export function useAuth() {
  return useContext(ContextoAuth);
}
