import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix broken Leaflet default marker icons in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const markerOrigin = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const markerDest = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DEFAULT_CENTER: [number, number] = [18.5204, 73.8567]; // Pune

function MapClickHandler({
  mode,
  onClick,
}: {
  mode: "origin" | "destination";
  onClick: (lat: number, lng: number, mode: "origin" | "destination") => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng, mode);
    },
  });
  return null;
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.2 });
  }, [target, map]);
  return null;
}

interface MapPickerProps {
  /** Current active selection mode */
  mode: "origin" | "destination";
  onModeChange?: (mode: "origin" | "destination") => void;
  /** Called when user clicks the map */
  onMapClick: (lat: number, lng: number, mode: "origin" | "destination") => void;
  originLat?: number | null;
  originLng?: number | null;
  destLat?: number | null;
  destLng?: number | null;
  /** Optional OSRM route polyline coordinates */
  routeCoords?: [number, number][];
  flyTarget?: [number, number] | null;
  height?: string;
}

export default function MapPicker({
  mode,
  onModeChange,
  onMapClick,
  originLat,
  originLng,
  destLat,
  destLng,
  routeCoords = [],
  flyTarget = null,
  height = "400px",
}: MapPickerProps) {
  const center: [number, number] =
    originLat && originLng ? [originLat, originLng] : DEFAULT_CENTER;

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      {onModeChange && (
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onModeChange("origin")}
            className={`flex-1 sm:px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "origin"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Set Pickup (A)
          </button>
          <button
            type="button"
            onClick={() => onModeChange("destination")}
            className={`flex-1 sm:px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "destination"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Set Drop-off (B)
          </button>
        </div>
      )}

      {/* Map */}
      <div
        className="w-full rounded-3xl overflow-hidden border border-white/40 shadow-xl"
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={12}
          style={{ width: "100%", height: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo target={flyTarget} />
          <MapClickHandler mode={mode} onClick={onMapClick} />
          {originLat && originLng && (
            <Marker position={[originLat, originLng]} icon={markerOrigin} />
          )}
          {destLat && destLng && (
            <Marker position={[destLat, destLng]} icon={markerDest} />
          )}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="#3b82f6" weight={5} opacity={0.85} />
          )}
        </MapContainer>
      </div>

      <p className="text-xs text-center text-slate-400 font-medium flex items-center justify-center gap-1">
        <MapPin className="size-3.5 text-primary" />
        Placing:{" "}
        <span className="font-bold text-primary">
          {mode === "origin" ? "Pickup Location" : "Drop-off Location"}
        </span>
        . Click anywhere on the map.
      </p>
    </div>
  );
}
