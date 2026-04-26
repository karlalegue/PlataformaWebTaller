import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import get_connection, init_db
from seguridad import hashear_contrasena


def crear_administrador(nombre_usuario: str, contrasena: str) -> None:
    init_db()

    conexion = get_connection()
    cursor = conexion.cursor()

    # Verifica si el administrador ya existe para no duplicarlo
    cursor.execute("SELECT id FROM admin WHERE username = ?", (nombre_usuario,))
    if cursor.fetchone():
        print(f"El administrador '{nombre_usuario}' ya existe.")
        conexion.close()
        return

    cursor.execute(
        "INSERT INTO admin (username, password_hash) VALUES (?, ?)",
        (nombre_usuario, hashear_contrasena(contrasena))
    )
    conexion.commit()
    conexion.close()
    print(f"✅ Administrador '{nombre_usuario}' creado exitosamente.")


if __name__ == "__main__":
    print("Crear administrador de Valle Simpson")
    nombre_usuario = input("Nombre de usuario: ").strip()
    contrasena = input("Contraseña: ").strip()

    if not nombre_usuario or not contrasena:
        print("El usuario y la contraseña no pueden estar vacíos.")
        sys.exit(1)

    crear_administrador(nombre_usuario, contrasena)
