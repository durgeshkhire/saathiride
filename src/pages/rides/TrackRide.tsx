import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rideApi } from "@/api/ride.api";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { markerOrigin, markerDest } from "@/components/map/MapPicker";
import { useRideLocation } from "@/hooks/useRideLocation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";

const markerDriver = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function AutoPanMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      animate: true,
      duration: 1.5,
    });
  }, [lat, lng, map]);
  return <Marker position={[lat, lng]} icon={markerDriver} />;
}

export default function TrackRide() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  const userEmail = localStorage.getItem("email");
  const isOwner = ride?.driverEmail === userEmail || ride?.driverName === localStorage.getItem("name");

  // Track the ride via WebSocket
  const { driverLocation } = useRideLocation(
    id || "",
    isOwner ? "DRIVER" : "PASSENGER",
    ride?.status === "ONGOING",
    ride?.driverName
  );

  useEffect(() => {
    if (!id) return;
    rideApi
      .getRideById(id)
      .then((res) => {
        const data = res.data?.data || res.data;
        setRide(data);
      })
      .catch(() => setError("Unable to load ride details."))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (ride?.originLat && ride?.originLng && ride?.destinationLat && ride?.destinationLng) {
      fetch(
        `https://router.project-osrm.org/route/v1/driving/${ride.originLng},${ride.originLat};${ride.destinationLng},${ride.destinationLat}?overview=full&geometries=geojson`
      )
        .then((r) => r.json())
        .then((data) => {
          if (data.routes?.[0]) {
            const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => [lat, lng]
            );
            setRouteCoords(coords);
          }
        })
        .catch(() => setRouteCoords([]));
    }
  }, [ride]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner size="lg" message="Connecting to live tracking..." />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center min-h-[50vh]">
        <div className="size-16 rounded-3xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="size-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
        <p className="text-slate-500 mb-6">{error || "Ride not found"}</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full px-4 pt-8 pb-16 h-screen flex flex-col">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-6 transition-colors group"
      >
        <div className="size-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronLeft className="size-5" />
        </div>
        Back to Ride
      </button>
      
      <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Live <span className="text-primary italic">Tracking.</span></h1>
          <p className="text-slate-500 font-medium">Follow the ride location in real-time.</p>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {ride?.status === "ONGOING" && !isOwner && driverLocation && (
          <div className="glass-card p-4 rounded-3xl bg-green-50/50 border border-green-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <p className="font-bold text-green-700">Driver is on the way</p>
            </div>
            <p className="text-xs font-medium text-green-600">
              Live: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
            </p>
          </div>
        )}
        {ride?.status === "ONGOING" && isOwner && (
          <div className="glass-card p-4 rounded-3xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </div>
                <p className="font-bold text-blue-700">Live Location Sharing Active</p>
              </div>
              {driverLocation && (
                <p className="text-xs font-medium text-blue-600 pl-6">
                  {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent w-full sm:w-auto"
              onClick={async () => {
                try {
                  await rideApi.completeRide(ride.id);
                  navigate(`/rides/${ride.id}`);
                } catch (err) {
                  console.error(err);
                  alert("Failed to complete ride.");
                }
              }}
            >
              Complete Ride
            </Button>
          </div>
        )}
        {ride?.status !== "ONGOING" && (
           <div className="glass-card p-4 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <p className="font-bold text-slate-700">Ride is not currently active.</p>
           </div>
        )}

        {ride.originLat && ride.originLng && ride.destinationLat && ride.destinationLng ? (
          <div className="rounded-[3rem] flex-1 min-h-[400px] overflow-hidden border border-white/40 shadow-xl relative z-0">
            <MapContainer
              center={[ride.originLat, ride.originLng]}
              zoom={10}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[ride.originLat, ride.originLng]} icon={markerOrigin} />
              <Marker position={[ride.destinationLat, ride.destinationLng]} icon={markerDest} />
              {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="#3b82f6" weight={5} opacity={0.85} />
              )}
              {driverLocation && <AutoPanMarker lat={driverLocation.lat} lng={driverLocation.lng} />}
            </MapContainer>
          </div>
        ) : null}
      </div>
    </div>
  );
}
