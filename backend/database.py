import sqlite3
import os

path=os.path.join(os.path.dirname(__file__), "data", "ValleSimpson.db")

def get_connection()-> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None: 
    if not os.path.exists(path):
        raise FileNotFoundError(f"No se encontro la bd en {path}")
    print(f"Base de datos encontrada en {path}")