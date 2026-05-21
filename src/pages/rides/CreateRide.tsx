import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { rideApi } from "@/api/ride.api";
import { vehicleApi } from "@/api/vehicle.api";
import { Vehicle } from "@/types";
import MapPicker from "@/components/map/MapPicker";
import Button from "@/components/common/Button";
import {
  MapPin,
  MapPinned,
  Calendar,
  Users,
  IndianRupee,
  Zap,
  ArrowRight,
  ArrowLeftRight,
  AlertCircle,
  CheckCircle2,
  Car,
  Plus,
  CarFront,
} from "lucide-react";

type Step = 1 | 2 | 3;

export default function CreateRide() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [originCity, setOriginCity] = useState("Pune");
  const [destCity, setDestCity] = useState("Mumbai");
  const [originAddr, setOriginAddr] = useState("");
  const [destAddr, setDestAddr] = useState("");
  const [originLat, setOriginLat] = useState<number | null>(null);
  const [originLng, setOriginLng] = useState<number | null>(null);
  const [destLat, setDestLat] = useState<number | null>(null);
  const [destLng, setDestLng] = useState<number | null>(null);
  const [departureTime, setDepartureTime] = useState("");
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(350);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [instantBooking, setInstantBooking] = useState(false);

  // Map state
  const [mapMode, setMapMode] = useState<"origin" | "destination">("origin");
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  // Autocomplete state
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const [showOriginDrop, setShowOriginDrop] = useState(false);
  const [showDestDrop, setShowDestDrop] = useState(false);
  const originTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth/login");
    else {
      setVehiclesLoading(true);
      vehicleApi
        .getMyVehicles()
        .then((res) => {
          const list = res.data?.data ?? res.data;
          setVehicles(Array.isArray(list) ? list : []);
        })
        .catch(() => setVehicles([]))
        .finally(() => setVehiclesLoading(false));
    }
  }, [navigate]);

  // OSRM route
  useEffect(() => {
    if (originLat && originLng && destLat && destLng) {
      fetch(
        `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`
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
    } else setRouteCoords([]);
  }, [originLat, originLng, destLat, destLng]);

  const fetchNominatim = (query: string, setter: (s: any[]) => void) => {
    if (!query || query.length < 3) { setter([]); return; }
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`, {
      headers: { "Accept-Language": "en" },
    })
      .then((r) => r.json())
      .then(setter)
      .catch(() => setter([]));
  };

  const reverseGeocode = async (lat: number, lng: number, mode: "origin" | "destination") => {
    setFlyTarget([lat, lng]);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await r.json();
      if (mode === "origin") {
        setOriginAddr(data.display_name || "");
        setOriginLat(lat); setOriginLng(lng);
      } else {
        setDestAddr(data.display_name || "");
        setDestLat(lat); setDestLng(lng);
      }
    } catch { /* silent */ }
  };

  const selectOrigin = (place: any) => {
    const lat = parseFloat(place.lat), lng = parseFloat(place.lon);
    setOriginAddr(place.display_name); setOriginLat(lat); setOriginLng(lng);
    setFlyTarget([lat, lng]); setOriginSuggestions([]); setShowOriginDrop(false);
  };

  const selectDest = (place: any) => {
    const lat = parseFloat(place.lat), lng = parseFloat(place.lon);
    setDestAddr(place.display_name); setDestLat(lat); setDestLng(lng);
    setFlyTarget([lat, lng]); setDestSuggestions([]); setShowDestDrop(false);
  };

  const flipCities = () => {
    setOriginCity(destCity); setDestCity(originCity);
    setOriginAddr(destAddr); setDestAddr(originAddr);
    setOriginLat(destLat); setOriginLng(destLng);
    setDestLat(originLat); setDestLng(originLng);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!originAddr || !destAddr) { setError("Please provide both origin and destination addresses."); return; }
      if (!originLat || !destLat) { setError("Please select precise locations from the map or suggestions."); return; }
    }
    if (step === 2) {
      if (!departureTime || !vehicleId) { setError("Please select a vehicle and set the departure time."); return; }
    }
    setError(null);
    setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await rideApi.createRide({
        vehicleId: vehicleId!,
        originCity,
        originAddress: originAddr,
        originLat: originLat!,
        originLng: originLng!,
        destinationCity: destCity,
        destinationAddress: destAddr,
        destinationLat: destLat!,
        destinationLng: destLng!,
        departureTime,
        totalSeats,
        pricePerSeat,
        instantBooking,
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create ride. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepLabels = [
    { num: 1, label: "Route", icon: MapPin },
    { num: 2, label: "Vehicle", icon: Car },
    { num: 3, label: "Details", icon: Zap },
  ];

  const inputCls =
    "w-full h-12 px-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all hover:border-primary/30 placeholder:text-slate-600 [color-scheme:dark]";

  return (
    <div className="flex flex-col items-center pt-8 pb-16 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-white">
            Create a <span className="text-gradient">Ride.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Share your journey and help others get there.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 w-full max-w-xs mx-auto">
          {stepLabels.map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`size-11 rounded-2xl flex items-center justify-center transition-all shadow-md ${step >= s.num ? "bg-gradient-to-r from-primary to-primary-dark text-white scale-110" : "bg-white/[0.04] text-slate-500 border border-white/[0.06]"}`}>
                  <s.icon className="size-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.num ? "text-primary-light" : "text-slate-500"}`}>{s.label}</span>
              </div>
              {idx < stepLabels.length - 1 && (
                <div className="flex-1 h-1 mx-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ${step > s.num ? "w-full" : "w-0"}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Success overlay */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="glass-card p-12 rounded-[3rem] text-center space-y-4 max-w-sm mx-4">
              <div className="size-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-10 text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Ride Created!</h2>
              <p className="text-slate-400">Your ride has been posted. Redirecting...</p>
            </div>
          </div>
        )}

        <div className="glass-card p-8 md:p-10 rounded-[3rem]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
              <AlertCircle className="size-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: Route */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="border-l-4 border-primary pl-4">
                  <h2 className="text-xl font-display font-bold text-white">Route Information</h2>
                </div>

                {/* City row */}
                <div className="flex flex-col md:flex-row gap-4 items-end relative">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Origin City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input value={originCity} readOnly className={`${inputCls} pl-9 font-bold cursor-default`} />
                    </div>
                  </div>
                  <div className="hidden md:block pb-0.5">
                    <button type="button" onClick={flipCities} className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                      <ArrowLeftRight className="size-4" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Destination City</label>
                    <div className="relative">
                      <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input value={destCity} readOnly className={`${inputCls} pl-9 font-bold cursor-default`} />
                    </div>
                  </div>
                </div>

                {/* Address autocomplete */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Origin Address</label>
                    <div className="relative">
                      <input
                        placeholder="Search origin address..."
                        value={originAddr}
                        onChange={(e) => {
                          setOriginAddr(e.target.value); setOriginLat(null); setOriginLng(null);
                          if (originTimer.current) clearTimeout(originTimer.current);
                          originTimer.current = setTimeout(() => fetchNominatim(e.target.value, setOriginSuggestions), 400);
                          setShowOriginDrop(true);
                        }}
                        onFocus={() => setShowOriginDrop(true)}
                        onBlur={() => setTimeout(() => setShowOriginDrop(false), 200)}
                        className={inputCls}
                      />
                      {showOriginDrop && originSuggestions.length > 0 && (
                        <ul className="absolute z-50 w-full mt-1 bg-surface-card border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden text-sm">
                          {originSuggestions.map((s, i) => (
                            <li key={i} onMouseDown={() => selectOrigin(s)} className="px-4 py-3 hover:bg-primary/10 cursor-pointer border-b border-white/[0.04] last:border-0 flex items-center gap-2 text-slate-300">
                              <MapPin className="size-3.5 text-primary shrink-0" />
                              <span className="truncate">{s.display_name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {originLat && <p className="text-[10px] text-accent flex items-center gap-1 pl-1"><CheckCircle2 className="size-3" /> Origin Selected</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Destination Address</label>
                    <div className="relative">
                      <input
                        placeholder="Search destination address..."
                        value={destAddr}
                        onChange={(e) => {
                          setDestAddr(e.target.value); setDestLat(null); setDestLng(null);
                          if (destTimer.current) clearTimeout(destTimer.current);
                          destTimer.current = setTimeout(() => fetchNominatim(e.target.value, setDestSuggestions), 400);
                          setShowDestDrop(true);
                        }}
                        onFocus={() => setShowDestDrop(true)}
                        onBlur={() => setTimeout(() => setShowDestDrop(false), 200)}
                        className={inputCls}
                      />
                      {showDestDrop && destSuggestions.length > 0 && (
                        <ul className="absolute z-50 w-full mt-1 bg-surface-card border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden text-sm">
                          {destSuggestions.map((s, i) => (
                            <li key={i} onMouseDown={() => selectDest(s)} className="px-4 py-3 hover:bg-primary/10 cursor-pointer border-b border-white/[0.04] last:border-0 flex items-center gap-2 text-slate-300">
                              <MapPinned className="size-3.5 text-primary shrink-0" />
                              <span className="truncate">{s.display_name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {destLat && <p className="text-[10px] text-accent flex items-center gap-1 pl-1"><CheckCircle2 className="size-3" /> Destination Selected</p>}
                  </div>
                </div>

                {/* Map picker */}
                <MapPicker
                  mode={mapMode}
                  onModeChange={setMapMode}
                  onMapClick={reverseGeocode}
                  originLat={originLat}
                  originLng={originLng}
                  destLat={destLat}
                  destLng={destLng}
                  routeCoords={routeCoords}
                  flyTarget={flyTarget}
                />
              </div>
            )}

            {/* STEP 2: Vehicle & Schedule */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="border-l-4 border-primary pl-4">
                  <h2 className="text-xl font-display font-bold text-white">Vehicle & Schedule</h2>
                </div>

                {/* Departure time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary" /> Departure Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Vehicle picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Select Your Vehicle</label>
                    <button type="button" onClick={() => navigate("/vehicles/add")} className="text-xs font-bold text-primary-light hover:underline flex items-center gap-1">
                      <Plus className="size-3" /> Add new
                    </button>
                  </div>

                  {vehiclesLoading ? (
                    <p className="text-sm text-slate-400 font-medium p-4">Loading vehicles...</p>
                  ) : vehicles.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center space-y-3">
                      <CarFront className="size-10 text-slate-600 mx-auto" />
                      <p className="text-slate-500 font-medium text-sm">No vehicles registered.</p>
                      <button type="button" onClick={() => navigate("/vehicles/add")} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold hover:opacity-90">
                        <Plus className="size-4" /> Add a Vehicle
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {vehicles.map((v: any) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => { setVehicleId(v.id); setTotalSeats(v.totalSeats); }}
                          className={`text-left p-4 rounded-2xl border-2 transition-all ${vehicleId === v.id ? "border-primary bg-primary/10" : "border-white/[0.06] bg-white/[0.03] hover:border-primary/30"}`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`size-9 rounded-xl flex items-center justify-center ${vehicleId === v.id ? "bg-primary text-white" : "bg-white/[0.06] text-slate-500"}`}>
                              <Car className="size-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-white text-sm">{v.carName}</p>
                              <p className="text-[11px] text-slate-500 uppercase tracking-wide">{v.carType}</p>
                            </div>
                            {vehicleId === v.id && <CheckCircle2 className="size-4 text-primary-light" />}
                          </div>
                          <div className="flex gap-2 text-[11px] font-bold text-slate-500">
                            <span className="bg-white/[0.06] px-2 py-0.5 rounded-lg">{v.carNumber}</span>
                            <span className="bg-white/[0.06] px-2 py-0.5 rounded-lg">{v.totalSeats} seats</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Seats & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                      <Users className="size-3.5 text-primary" /> Available Seats
                    </label>
                    <input type="number" min={1} max={7} value={totalSeats} onChange={(e) => setTotalSeats(Number(e.target.value))} className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                      <IndianRupee className="size-3.5 text-primary" /> Price Per Seat (₹)
                    </label>
                    <input type="number" min={0} value={pricePerSeat} onChange={(e) => setPricePerSeat(Number(e.target.value))} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Details */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="border-l-4 border-primary pl-4">
                  <h2 className="text-xl font-display font-bold text-white">Additional Details</h2>
                </div>

                <div
                  onClick={() => setInstantBooking((b) => !b)}
                  className={`flex items-center justify-between p-6 rounded-3xl border cursor-pointer select-none transition-all ${instantBooking ? "bg-primary/10 border-primary" : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors ${instantBooking ? "bg-primary text-white" : "bg-white/[0.06] text-slate-500"}`}>
                      <Zap className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Instant Booking</p>
                      <p className="text-sm text-slate-500 font-medium">Passengers can book without your manual approval.</p>
                    </div>
                  </div>
                  <div className={`size-6 rounded-full border-4 flex items-center justify-center transition-all ${instantBooking ? "border-primary bg-primary" : "border-slate-300"}`}>
                    {instantBooking && <CheckCircle2 className="text-white size-3" />}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => step > 1 ? (setError(null), setStep((s) => (s - 1) as Step)) : navigate("/")}
                className="flex-1"
              >
                {step > 1 ? "Back" : "Cancel"}
              </Button>

              {step < 3 ? (
                <Button type="button" size="lg" onClick={nextStep} className="flex-[2] gap-2">
                  Next Step <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" size="lg" isLoading={isLoading} className="flex-[2] gap-2">
                  Publish Ride <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
