from passlib.context import CryptContext

contexto_bcrypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashear_contrasena(contrasena: str) -> str:
    return contexto_bcrypt.hash(contrasena)

def verificar_contrasena(plana: str, hasheada: str) -> bool:
    return contexto_bcrypt.verify(plana, hasheada)


