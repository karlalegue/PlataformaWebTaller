from fastapi import APIRouter, HTTPException
<<<<<<< HEAD
from typing import List, Optional
from database import get_connection
from models.emprendimiento import Emprendimiento, detalleEmprendimiento

router = APIRouter(prefix="/api/emprendimientos", tags=["emprendimientos"])

@router.get("/categorias", response_model=List[str])
def get_categorias():
    """Devuelve la lista de categorías únicas para el selector de filtros."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DISTINCT categoria_emprendimiento
        FROM emprendimientos
        ORDER BY categoria_emprendimiento ASC
    """)
    filas = cursor.fetchall()
    conn.close()
    return [fila["categoria_emprendimiento"] for fila in filas]


@router.get("/", response_model=List[Emprendimiento])
def get_emprendimientos(categoria: Optional[str] = None):
    """
    Devuelve el listado de emprendimientos.
    Si se pasa ?categoria=Minimarket filtra por esa categoría.
    Si no se pasa, devuelve todos.
    """
    conn = get_connection()
    cursor = conn.cursor()
    if categoria:
        cursor.execute("""SELECT id, nombre_emprendimiento, categoria_emprendimiento FROM emprendimientos WHERE categoria_emprendimiento = ? ORDER BY nombre_emprendimiento ASC""", (categoria,))
    else:
        cursor.execute("""SELECT id, nombre_emprendimiento, categoria_emprendimiento FROM emprendimientos ORDER BY nombre_emprendimiento ASC""")
    filas = cursor.fetchall()
    conn.close()
    return [dict(fila) for fila in filas]


@router.get("/{emprendimiento_id}", response_model=detalleEmprendimiento)
def get_emprendimiento(emprendimiento_id: int):
    """Devuelve la ficha completa de un emprendimiento por su id."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM emprendimientos WHERE id = ?", (emprendimiento_id,))
    fila = cursor.fetchone()
    conn.close()
    if fila is None:
        raise HTTPException(status_code=404, detail="Emprendimiento no encontrado")
    return dict(fila)
=======
from typing import List
from database import get_connection
from models.emprendimiento import Emprendimiento, detalleEmprendimiento
router = APIRouter(prefix="/api/emprendimientos", tags=["emprendimientos"])



@router.get("/", response_model=List[Emprendimiento])
def get_emprendimientos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre_emprendimiento, categoria_emprendimiento FROM emprendimientos ORDER BY nombre_emprendimiento ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@router.get("/{emprendimiento_id}", response_model=detalleEmprendimiento)
def get_emprendimiento(emprendimiento_id:int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM emprendimientos WHERE id= ?", (emprendimiento_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Emprendimiento no encontrado")
    return dict(row)
>>>>>>> 05839caf310bc7295688df458bf48275c1ca2437
