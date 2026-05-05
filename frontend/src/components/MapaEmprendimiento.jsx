import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapaEmprendimiento.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });


export default function MapaEmprendimiento({ nombre, latitud, longitud }) {

  if (!latitud || !longitud) {
    return (
      <p className="mapa-sin-coordenadas">
        Ubicación no disponible aún.
      </p>
    );
  }

  const posicion = [latitud, longitud];

  return (
    <div className="mapa-contenedor">
      <MapContainer
        center={posicion}
        zoom={15}
        scrollWheelZoom={false}
        className="mapa"
      >
       
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <Marker position={posicion}>
          <Popup>{nombre}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
