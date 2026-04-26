from fastapi import APIRouter, HTTPException
from typing import List, Optional
from database import get_connection
from models.emprendimiento import Emprendimiento, detalleEmprendimiento

router = APIRouter(prefix="/api/emprendimientos", tags=["emprendimientos"])


@router.get("/categorias", response_model=List[str])
def get_categorias():
    conexion = get_connection()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre FROM categorias ORDER BY nombre ASC")
    filas = cursor.fetchall()
    conexion.close()
    return [fila["nombre"] for fila in filas]


@router.get("/", response_model=List[Emprendimiento])
def get_emprendimientos(categoria: Optional[str] = None):

    conexion = get_connection()
    cursor = conexion.cursor()

    if categoria:
        cursor.execute("""
            SELECT e.id,
                   e.nombre_emprendimiento,
                   c.nombre AS categoria_emprendimiento
            FROM emprendimientos e
            JOIN categorias c ON e.categoria_id = c.id
            WHERE c.nombre = ?
            ORDER BY e.nombre_emprendimiento ASC
        """, (categoria,))
    else:
        cursor.execute("""
            SELECT e.id,
                   e.nombre_emprendimiento,
                   c.nombre AS categoria_emprendimiento
            FROM emprendimientos e
            JOIN categorias c ON e.categoria_id = c.id
            ORDER BY e.nombre_emprendimiento ASC
        """)

    filas = cursor.fetchall()
    conexion.close()
    return [dict(fila) for fila in filas]


@router.get("/{emprendimiento_id}", response_model=detalleEmprendimiento)
def get_emprendimiento(emprendimiento_id: int):
    conexion = get_connection()
    cursor = conexion.cursor()
    cursor.execute("""
        SELECT e.id,
               e.nombre_emprendimiento,
               c.nombre AS categoria_emprendimiento,
               e.horario,
               e.telefono,
               e.redes_sociales,
               e.direccion,
               e.latitud,
               e.longitud
        FROM emprendimientos e
        JOIN categorias c ON e.categoria_id = c.id
        WHERE e.id = ?
    """, (emprendimiento_id,))
    fila = cursor.fetchone()
    conexion.close()

    if fila is None:
        raise HTTPException(status_code=404, detail="Emprendimiento no encontrado")
    return dict(fila)