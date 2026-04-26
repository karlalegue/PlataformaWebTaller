from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import init_db
from controllers.emprendimientos import router as enrutador_emprendimientos
from controllers.auth import enrutador as enrutador_auth

app = FastAPI(
    title="Valle Simpson API",
    description="Plataforma web para la visibilidad de servicios y comercio local en Valle Simpson",
    version="Release 2"
)

url_frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[url_frontend, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def al_iniciar():
    init_db()
    print("Base de datos iniciada")

app.include_router(enrutador_emprendimientos)
app.include_router(enrutador_auth)

@app.get("/", tags=["health"])
def raiz():
    return {"estado": "ok", "mensaje": "API Valle Simpson funcionando correctamente"}