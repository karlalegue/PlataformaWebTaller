from pydantic import BaseModel
class SolicitudLogin(BaseModel):
    nombre_usuario: str
    contrasena: str
class RespuestaLogin(BaseModel):
    autenticado: bool
    nombre_usuario: str
