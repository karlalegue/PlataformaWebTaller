const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";


export async function getEmprendimientos(categoria = null) {
  const url = categoria
    ? `${URL_BASE}/emprendimientos?categoria=${encodeURIComponent(categoria)}`
    : `${URL_BASE}/emprendimientos`;

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error("Error al obtener los emprendimientos. Intenta más tarde.");
  }
  return respuesta.json();
}


export async function getCategorias() {
  const respuesta = await fetch(`${URL_BASE}/emprendimientos/categorias`);
  if (!respuesta.ok) {
    throw new Error("Error al obtener las categorías.");
  }
  return respuesta.json();
}


export async function getEmprendimiento(id) {
  const respuesta = await fetch(`${URL_BASE}/emprendimientos/${id}`);
  if (respuesta.status === 404) {
    throw new Error("Este emprendimiento no existe o fue eliminado.");
  }
  if (!respuesta.ok) {
    throw new Error("Error al obtener el emprendimiento.");
  }
  return respuesta.json();
}


export async function iniciarSesionAdmin(nombreUsuario, contrasena) {
  const respuesta = await fetch(`${URL_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_usuario: nombreUsuario, contrasena }),
  });
  if (respuesta.status === 401) {
    throw new Error("Usuario o contraseña incorrectos.");
  }
  if (!respuesta.ok) {
    throw new Error("Error al iniciar sesión.");
  }
  return respuesta.json();
}
