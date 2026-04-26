import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

CLAVE_SECRETA = os.getenv("SECRET_KEY", "clave-local-desarrollo-cambiar-en-produccion")
ALGORITMO = "HS256"
HORAS_EXPIRACION = 10
contexto_bcrypt = CryptContext(schemes=["bcrypt"], deprecated="auto")
esquema_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hashear_contrasena(contrasena: str) -> str:
    return contexto_bcrypt.hash(contrasena)


def verificar_contrasena(plana: str, hasheada: str) -> bool:
    return contexto_bcrypt.verify(plana, hasheada)


def crear_token(nombre_usuario: str) -> str:
    datos_token = {
        "sub": nombre_usuario,
        "exp": datetime.utcnow() + timedelta(hours=HORAS_EXPIRACION)
    }
    return jwt.encode(datos_token, CLAVE_SECRETA, algorithm=ALGORITMO)


def obtener_admin_actual(token: str = Depends(esquema_oauth2)) -> str:
    try:
        datos = jwt.decode(token, CLAVE_SECRETA, algorithms=[ALGORITMO])
        nombre_usuario = datos.get("sub")
        if nombre_usuario is None:
            raise HTTPException(status_code=401, detail="Token invalido")
        return nombre_usuario
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalido o expirado")
