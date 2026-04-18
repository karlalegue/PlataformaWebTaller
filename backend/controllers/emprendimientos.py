from fastapi import APIRouter, HTTPException
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