from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import init_db
from controllers.emprendimientos import router as emprendimientos_router

app = FastAPI(
    title="Valle Simpson API",
    description="Plataforma web para la visibilidad de servicios y comercio local en Valle Simpson",
    version = "MVP"
)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    print("Base de datos iniciada")
    
app.include_router(emprendimientos_router)

@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "mensaje": "API Valle Simpson funcionando correctamente"}