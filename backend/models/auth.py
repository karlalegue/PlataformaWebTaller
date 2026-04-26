from pydantic import BaseModel
class SolicitudLogin(BaseModel):
    nombre_usuario: str
    contrasena: str
class TokenRespuesta(BaseModel):
    token_acceso: str
    tipo_token: str
