import sqlite3
import os

ruta = os.path.join(os.path.dirname(__file__), "data", "ValleSimpson.db")

def get_connection() -> sqlite3.Connection:
    conexion = sqlite3.connect(ruta)
    conexion.row_factory = sqlite3.Row
    return conexion

def init_db() -> None:
    if not os.path.exists(ruta):
        raise FileNotFoundError(f"No se encontró la BD en {ruta}")

    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute("""CREATE TABLE IF NOT EXISTS admin (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            username      TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)

    conexion.commit()
    conexion.close()
    print(f"Base de datos encontrada en: {ruta}")
