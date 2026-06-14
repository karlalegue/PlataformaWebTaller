

def test_listar_categorias(cliente):
    """GET /categorias debe retornar 200 y una lista de strings."""
    respuesta = cliente.get("/api/emprendimientos/categorias")
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert isinstance(datos, list)
    assert len(datos) > 0
    # Cada categoría debe ser un string
    for categoria in datos:
        assert isinstance(categoria, str)


def test_categorias_contiene_esperadas(cliente):
    """Verifica que las categorías reales de la BD están presentes."""
    respuesta = cliente.get("/api/emprendimientos/categorias")
    categorias = respuesta.json()
    assert "Avicola" in categorias
    assert "Artesanias en Madera" in categorias


def test_categorias_ordenadas(cliente):
    """Las categorías deben venir ordenadas alfabéticamente (ORDER BY nombre ASC)."""
    respuesta = cliente.get("/api/emprendimientos/categorias")
    categorias = respuesta.json()
    assert categorias == sorted(categorias)