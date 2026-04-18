
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export async function getEmprendimientos() {
  const response = await fetch(`${BASE_URL}/emprendimientos`);
  if (!response.ok) {
    throw new Error("Error al obtener los emprendimientos. Intenta más tarde.");
  }
  return response.json();
}

export async function getEmprendimiento(id) {
  const response = await fetch(`${BASE_URL}/emprendimientos/${id}`);
  if (response.status === 404) {
    throw new Error("Este emprendimiento no existe o fue eliminado.");
  }
  if (!response.ok) {
    throw new Error("Error al obtener el emprendimiento.");
  }
  return response.json();
}
