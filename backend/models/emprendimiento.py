from pydantic import BaseModel
from typing import Optional

class Emprendimiento(BaseModel):
    id: int
    nombre_emprendimiento: str
    categoria_emprendimiento: str
    
    
class detalleEmprendimiento(BaseModel):
    id: int
    nombre_emprendimiento: str
    categoria_emprendimiento: str
    horario: Optional[str] = None
    telefono: Optional[str] = None
    redes_sociales: Optional[str] = None
    direccion: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    
class EmprendimientoCrear(BaseModel):
    nombre_emprendimiento: str
    categoria_emprendimiento: str
    horario: Optional[str] = None
    telefono: Optional[str] = None
    redes_sociales: Optional[str] = None
    direccion: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None


class EmprendimientoEditar(BaseModel):
    nombre_emprendimiento: Optional[str] = None
    categoria_emprendimiento: Optional[str] = None
    horario: Optional[str] = None
    telefono: Optional[str] = None
    redes_sociales: Optional[str] = None
    direccion: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None