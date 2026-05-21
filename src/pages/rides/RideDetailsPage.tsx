import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { rideApi } from "@/api/ride.api";
import { bookingApi } from "@/api/booking.api";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { markerOrigin, markerDest } from "@/components/map/MapPicker";

import {
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  MapPin,
  User,
  ShieldCheck,
  Zap,
  AlertCircle,
  Info,
} from "lucide-react";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import StarRating from "@/components/common/StarRating";

export default function RideDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  const userEmail = localStorage.getItem("email");
  const isOwner = ride?.driverEmail === userEmail || ride?.driverName === localStorage.getItem("name");

  const [hasApprovedBooking, setHasApprovedBooking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!id || !localStorage.getItem("token")) return;
    bookingApi
      .getMyBookings()
      .then((res) => {
        const data = res.data?.data || res.data;
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        const approved = list.some(
          (b) => b.rideId === id && b.status === "APPROVED"
        );
        setHasApprovedBooking(approved);
      })
      .catch(() => {});
  }, [id]);

  const handleCancelRide = async () => {
    if (!id) return;
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this ride? This action cannot be undone."
    );
    if (!confirmCancel) return;

    setIsCancelling(true);
    try {
      await rideApi.cancelRide(id);
      // Refresh ride details
      const res = await rideApi.getRideById(id);
      setRide(res.data?.data || res.data);
      alert("Ride cancelled successfully.");
    } catch (err: any) {
      console.error("Error cancelling ride:", err);
      alert(err.response?.data?.message || "Failed to cancel ride. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };



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
        <Spinner size="lg" message="Fetching journey details..." />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center min-h-[50vh]">
        <div className="size-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <AlertCircle className="size-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Oops!</h2>
        <p className="text-slate-500 mb-6">{error || "Ride not found"}</p>
        <Button onClick={() => navigate("/")}>Back to Search</Button>
      </div>
    );
  }

  const isDateTime = ride.departureTime?.includes("T");
  const depDate = isDateTime ? format(new Date(ride.departureTime), "EEEE, MMMM do, yyyy") : "—";
  const depTime = isDateTime ? format(new Date(ride.departureTime), "hh:mm a") : "—";

  return (
    <div className="mx-auto max-w-5xl w-full px-4 pt-8 pb-16">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-light font-bold mb-8 transition-colors group"
      >
        <div className="size-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary-light transition-all">
          <ChevronLeft className="size-5" />
        </div>
        Go Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Header */}
          <div className="glass-card p-8 md:p-10 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.08] rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="relative flex flex-col gap-6">
              {[
                { label: "Pickup City", city: ride.originCity, address: ride.originAddress, isPrimary: true },
                { label: "Destination City", city: ride.destinationCity, address: ride.destinationAddress, isPrimary: false },
              ].map(({ label, city, address, isPrimary }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 border ${isPrimary ? "bg-primary/10 border-primary/20" : "bg-accent/10 border-accent/20"}`}>
                    <MapPin className={`size-6 ${isPrimary ? "text-primary-light" : "text-accent"}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
                    <h3 className="text-2xl font-display font-bold text-white">{city}</h3>
                    {address && <p className="text-sm text-slate-500 font-medium mt-0.5">{address}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          {ride.originLat && ride.originLng && ride.destinationLat && ride.destinationLng ? (
            <div className="space-y-4">
              <div className="rounded-[3rem] overflow-hidden border border-white/[0.08] shadow-xl h-[350px]">
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
                    <Polyline positions={routeCoords} color="#6C3CE1" weight={5} opacity={0.85} />
                  )}

                </MapContainer>
              </div>
            </div>
          ) : null}

          {/* Date / Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Calendar, title: "Departure Date", value: depDate },
              { icon: Clock, title: "Departure Time", value: depTime },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="glass-card p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="size-5 text-primary-light" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
                  </div>
                </div>
                <p className="font-bold text-white text-lg">{value}</p>
              </div>
            ))}
          </div>

          {/* Vehicle info */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Zap className="size-7" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{ride.carName || "Vehicle"}</p>
                  <p className="text-sm text-slate-500 font-medium">
                    Plate: <span className="font-bold text-slate-300">{ride.carNumber || "—"}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-primary-light" />
                <span className="text-lg font-bold text-white">
                  {ride.availableSeats ?? ride.totalSeats} / {ride.totalSeats || 4} seats left
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {ride.description && (
            <div className="glass-card p-6 rounded-3xl">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Info className="size-4 text-primary-light" /> About this Journey
              </h4>
              <p className="text-slate-400 font-medium leading-relaxed">{ride.description}</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Driver card */}
          <div className="glass-card p-6 rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/[0.08] to-transparent pointer-events-none" />
            <div className="size-20 rounded-[1.75rem] bg-white/[0.06] border border-white/[0.08] mx-auto mb-4 flex items-center justify-center relative">
              <User className="size-10 text-slate-500" />
              <div className="absolute -bottom-2 -right-2 size-7 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white ring-4 ring-surface-card">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <h4 className="text-xl font-display font-bold text-white">{ride.driverName || "Driver"}</h4>
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest italic mb-3">Verified Driver</p>
            {ride.driverRating && (
              <div className="flex justify-center">
                <StarRating rating={ride.driverRating} showValue size="md" />
              </div>
            )}
          </div>

          {/* Booking card */}
          <div className="bg-surface-card text-white p-7 rounded-[3rem] relative overflow-hidden border border-white/[0.06]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.15] rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            <div className="relative space-y-6">
              <div>
                <h4 className="text-xl font-display font-bold mb-1">Book Your Seat</h4>
                <p className="text-slate-500 text-sm font-medium">Secure your spot instantly.</p>
              </div>

              <div className="space-y-3 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-sm">1 Seat (Standard)</span>
                  <span className="font-bold flex items-center text-slate-300">
                    <IndianRupee className="size-3.5" />{ride.pricePerSeat ?? ride.price ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-white text-lg">
                  <span>Total</span>
                  <span className="text-primary-light flex items-center">
                    <IndianRupee className="size-4" />{ride.pricePerSeat ?? ride.price ?? "—"}
                  </span>
                </div>
              </div>

              {ride?.status === "CANCELLED" ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                  <p className="text-red-400 font-bold uppercase tracking-widest text-xs">This ride has been cancelled</p>
                </div>
              ) : isOwner ? (
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => navigate(`/rides/manage/${id}`)}
                    fullWidth
                    size="lg"
                    className="!bg-white !text-slate-900 hover:!bg-white/90 hover:scale-[1.02] !shadow-none"
                  >
                    Manage Ride
                  </Button>
                  {ride?.status === "UPCOMING" && (
                    <Button
                      onClick={handleCancelRide}
                      fullWidth
                      size="lg"
                      variant="danger"
                      isLoading={isCancelling}
                    >
                      Cancel Ride
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => navigate(`/rides/book/${id}`)}
                  fullWidth
                  size="lg"
                  className="hover:scale-[1.02]"
                >
                  Request Booking
                </Button>
              )}
              {(hasApprovedBooking || isOwner) && ride?.status === "ONGOING" && (
                <Button
                  onClick={() => navigate(`/rides/track/${id}`)}
                  fullWidth
                  size="lg"
                  className="!bg-gradient-to-r !from-accent !to-teal-600 !shadow-lg !shadow-accent/20 hover:scale-[1.02]"
                >
                  <MapPin className="size-5 mr-2" /> Track Ride
                </Button>
              )}
              <p className="text-[10px] text-center text-slate-600 uppercase font-bold tracking-widest mt-2">
                Free Cancellation before 2 hours
              </p>
            </div>
          </div>

          {/* Security badge */}
          <div className="p-5 border border-dashed border-white/[0.08] rounded-3xl flex items-center gap-4">
            <div className="size-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Secure</p>
              <p className="text-xs text-slate-500 font-medium">Your data is encrypted & safe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
