import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowLeftRight,
  Calendar,
  Users,
  Search,
  Minus,
  Plus,
  AlertCircle,
  IndianRupee,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { rideApi } from "@/api/ride.api";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

export default function RideSearchForm() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("Mumbai");
  const [drop, setDrop] = useState("Pune");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFlip = () => {
    setPickup(drop);
    setDrop(pickup);
  };

  const handleSearch = async () => {
    if (!date) {
      setError("Please select a departure date.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const response = await rideApi.searchRides({
        originCity: pickup,
        destinationCity: drop,
        departureDate: date,
        seats: passengers,
      });
      const data = response.data;
      let rides: any[] = [];
      if (Array.isArray(data)) rides = data;
      else if (data?.data?.content) rides = data.data.content;
      else if (Array.isArray(data?.content)) rides = data.content;
      else if (Array.isArray(data?.data)) rides = data.data;

      setResults(rides);
      if (rides.length === 0) setError("No rides found for your criteria.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto glass-card p-6 md:p-8 rounded-3xl glow-primary relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="space-y-6 relative">
        {/* Row 1: Locations */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 md:items-end relative">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-1">
              <MapPin className="size-3.5 text-primary-light" /> From
            </label>
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Origin city"
              className="w-full h-12 px-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600 hover:border-primary/30"
            />
          </div>

          <div className="md:flex hidden items-center justify-center pb-0.5">
            <button
              onClick={handleFlip}
              className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light hover:bg-primary/20 hover:scale-105 transition-all"
            >
              <ArrowLeftRight className="size-4" />
            </button>
          </div>

          {/* Mobile flip */}
          <div className="md:hidden absolute right-4 top-[4.2rem] z-10">
            <button
              onClick={handleFlip}
              className="size-9 rounded-full bg-surface-card flex items-center justify-center text-primary-light hover:bg-primary/10 transition-colors shadow-lg border border-white/[0.08]"
            >
              <ArrowLeftRight className="size-4 rotate-90" />
            </button>
          </div>

          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-1">
              <MapPin className="size-3.5 text-accent" /> To
            </label>
            <input
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
              placeholder="Destination city"
              className="w-full h-12 px-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600 hover:border-primary/30"
            />
          </div>
        </div>

        {/* Row 2: Date, Passengers, Search */}
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-1">
              <Calendar className="size-3.5 text-primary-light" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full h-12 px-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer transition-all hover:border-primary/30 [color-scheme:dark]"
            />
          </div>

          <div className="flex-1 w-full space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-1">
              <Users className="size-3.5 text-primary-light" /> Passengers
            </label>
            <div className="flex items-center justify-between h-12 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3">
              <button
                onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                className="size-7 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-colors disabled:opacity-30 text-slate-400"
                disabled={passengers <= 1}
              >
                <Minus className="size-3.5" />
              </button>
              <span className="font-bold text-white text-lg">{passengers}</span>
              <button
                onClick={() => setPassengers((p) => Math.min(7, p + 1))}
                className="size-7 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-colors disabled:opacity-30 text-slate-400"
                disabled={passengers >= 7}
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Button
              onClick={handleSearch}
              isLoading={isLoading}
              size="lg"
              className="w-full md:w-48 gap-2"
            >
              <Search className="size-5" />
              {isLoading ? "Searching..." : "Find Rides"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && <Spinner message="Searching for rides..." />}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-10 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              Available Rides
              <span className="bg-primary/20 text-primary-light text-xs px-2.5 py-0.5 rounded-full font-bold">
                {results.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Sorted by earliest departure</p>
          </div>
          <div className="grid gap-3">
            {results.map((ride, idx) => (
              <div
                key={ride.id || idx}
                onClick={() => navigate(`/rides/${ride.id}`)}
                className="glass-card p-5 rounded-2xl hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                      <MapPin className="size-6 text-slate-500 group-hover:text-primary-light transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{ride.driverName || "Driver"}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {ride.departureTime?.includes("T")
                            ? format(new Date(ride.departureTime), "MMM d, yyyy")
                            : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {ride.departureTime?.includes("T")
                            ? format(new Date(ride.departureTime), "hh:mm a")
                            : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {ride.availableSeats ?? ride.totalSeats} left
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Per Seat</p>
                      <p className="text-xl font-bold text-primary-light flex items-center justify-end gap-0.5">
                        <IndianRupee className="size-4" />
                        {ride.pricePerSeat ?? ride.price}
                      </p>
                    </div>
                    <button className="h-10 px-5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
