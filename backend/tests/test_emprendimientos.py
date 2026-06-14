

def test_listar_emprendimientos(cliente):
    """GET / debe retornar 200 y una lista con al menos un emprendimiento."""
    respuesta = cliente.get("/api/emprendimientos/")
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert isinstance(datos, list)
    assert len(datos) > 0
    # Verifica que cada item tiene los campos que el frontend necesita
    assert "id" in datos[0]
    assert "nombre_emprendimiento" in datos[0]
    assert "categoria_emprendimiento" in datos[0]


def test_listar_filtrado_por_categoria(cliente):
    """GET /?categoria=X debe retornar solo emprendimientos de esa categoría."""
    respuesta = cliente.get("/api/emprendimientos/?categoria=Avicola")
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert isinstance(datos, list)
    # Todos los resultados deben ser de la categoría filtrada
    for item in datos:
        assert item["categoria_emprendimiento"] == "Avicola"


def test_listar_categoria_inexistente(cliente):
    """GET con categoría que no existe debe retornar 200 con lista vacía."""
    respuesta = cliente.get("/api/emprendimientos/?categoria=CategoriaFalsa")
    assert respuesta.status_code == 200
    assert respuesta.json() == []


# ---- DETALLE ----

def test_detalle_existente(cliente):
    """GET /{id} con ID real debe retornar 200 y todos los campos del detalle."""
    respuesta = cliente.get("/api/emprendimientos/1")
    assert respuesta.status_code == 200
    datos = respuesta.json()
    # Campos obligatorios
    assert datos["id"] == 1
    assert "nombre_emprendimiento" in datos
    assert "categoria_emprendimiento" in datos
    # Campos opcionales del detalle (deben existir aunque sean null)
    assert "horario" in datos
    assert "telefono" in datos
    assert "redes_sociales" in datos
    assert "direccion" in datos
    assert "latitud" in datos
    assert "longitud" in datos


def test_detalle_inexistente(cliente):
    """GET /{id} con ID que no existe debe retornar 404."""
    respuesta = cliente.get("/api/emprendimientos/99999")
    assert respuesta.status_code == 404
    assert "detail" in respuesta.json()


# ---- CREAR ----

def test_crear_emprendimiento_completo(cliente):
    """POST / con todos los campos debe crear el registro y retornarlo."""
    nuevo = {
        "nombre_emprendimiento": "Prueba Test Completo",
        "categoria_emprendimiento": "Avicola",
        "horario": "Lunes a Viernes 9:00-18:00",
        "telefono": "+56912345678",
        "redes_sociales": "@prueba",
        "direccion": "Sector Las Quemas s/n",
        "latitud": -45.572,
        "longitud": -72.066
    }
    respuesta = cliente.post("/api/emprendimientos/", json=nuevo)
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["nombre_emprendimiento"] == "Prueba Test Completo"
    assert datos["categoria_emprendimiento"] == "Avicola"
    assert datos["latitud"] == -45.572
    assert datos["longitud"] == -72.066
    assert "id" in datos

    # Limpieza: eliminar el registro creado
    cliente.delete(f"/api/emprendimientos/{datos['id']}")


def test_crear_emprendimiento_minimo(cliente):
    """POST / con solo los campos obligatorios debe funcionar (opcionales en null)."""
    nuevo = {
        "nombre_emprendimiento": "Prueba Mínima",
        "categoria_emprendimiento": "Artesanias en Madera"
    }
    respuesta = cliente.post("/api/emprendimientos/", json=nuevo)
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["nombre_emprendimiento"] == "Prueba Mínima"

    assert datos["latitud"] is None
    assert datos["longitud"] is None
    assert datos["telefono"] is None

    # Limpieza
    cliente.delete(f"/api/emprendimientos/{datos['id']}")


def test_crear_emprendimiento_categoria_invalida(cliente):
    """POST / con categoría que no existe en la BD debe retornar 400."""
    nuevo = {
        "nombre_emprendimiento": "Prueba Categoría Mala",
        "categoria_emprendimiento": "CategoriaQueNoExiste"
    }
    respuesta = cliente.post("/api/emprendimientos/", json=nuevo)
    assert respuesta.status_code == 400


# ---- EDITAR ----

def test_editar_emprendimiento(cliente):
    """PUT /{id} debe actualizar los datos del emprendimiento."""
    # Primero crea uno temporal
    nuevo = {
        "nombre_emprendimiento": "Para Editar",
        "categoria_emprendimiento": "Avicola"
    }
    creado = cliente.post("/api/emprendimientos/", json=nuevo).json()
    id_creado = creado["id"]

    # Editar
    edicion = {
        "nombre_emprendimiento": "Nombre Editado",
        "categoria_emprendimiento": "Artesanias en Madera",
        "telefono": "+56911111111"
    }
    respuesta = cliente.put(f"/api/emprendimientos/{id_creado}", json=edicion)
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["nombre_emprendimiento"] == "Nombre Editado"
    assert datos["categoria_emprendimiento"] == "Artesanias en Madera"
    assert datos["telefono"] == "+56911111111"

    # Limpieza
    cliente.delete(f"/api/emprendimientos/{id_creado}")


def test_editar_emprendimiento_inexistente(cliente):
    """PUT /{id} con ID que no existe debe retornar 404."""
    edicion = {
        "nombre_emprendimiento": "No existe",
        "categoria_emprendimiento": "Avicola"
    }
    respuesta = cliente.put("/api/emprendimientos/99999", json=edicion)
    assert respuesta.status_code == 404


# ---- ELIMINAR ----

def test_eliminar_emprendimiento(cliente):
    """DELETE /{id} debe eliminar el registro y un GET posterior debe dar 404."""
    # Crea uno temporal
    nuevo = {
        "nombre_emprendimiento": "Para Eliminar",
        "categoria_emprendimiento": "Avicola"
    }
    creado = cliente.post("/api/emprendimientos/", json=nuevo).json()
    id_creado = creado["id"]

    # Eliminar
    respuesta = cliente.delete(f"/api/emprendimientos/{id_creado}")
    assert respuesta.status_code == 200
    assert "mensaje" in respuesta.json()

    # Verificar que ya no existe
    get_posterior = cliente.get(f"/api/emprendimientos/{id_creado}")
    assert get_posterior.status_code == 404


def test_eliminar_emprendimiento_inexistente(cliente):
    """DELETE /{id} con ID que no existe debe retornar 404."""
    respuesta = cliente.delete("/api/emprendimientos/99999")
    assert respuesta.status_code == 404