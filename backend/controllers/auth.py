
from fastapi import APIRouter, HTTPException
from database import get_connection
from models.auth import SolicitudLogin, TokenRespuesta
from seguridad import verificar_contrasena, crear_token

enrutador = APIRouter(prefix="/api/auth", tags=["autenticación"])
@enrutador.post("/login", response_model=TokenRespuesta)
def iniciar_sesion(credenciales: SolicitudLogin):
    conexion = get_connection()
    cursor = conexion.cursor()
    cursor.execute(
        "SELECT password_hash FROM admin WHERE username = ?",
        (credenciales.nombre_usuario,)
    )
    fila = cursor.fetchone()
    conexion.close()
    if fila is None or not verificar_contrasena(credenciales.contrasena, fila["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos"
        )
    token = crear_token(credenciales.nombre_usuario)
    return {"token_acceso": token, "tipo_token": "bearer"}
