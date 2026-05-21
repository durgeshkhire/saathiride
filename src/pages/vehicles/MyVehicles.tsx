import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleApi } from "@/api/vehicle.api";
import { Vehicle } from "@/types";
import {
  Car,
  Hash,
  Layers,
  Users,
  Plus,
  Loader2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import Button from "@/components/common/Button";

const TYPE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  SEDAN: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  SUV: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  HATCHBACK: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
};

export default function MyVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }
    vehicleApi
      .getMyVehicles()
      .then((res) => {
        const list = res.data?.data ?? res.data;
        setVehicles(Array.isArray(list) ? list : []);
      })
      .catch(() => setError("Failed to load vehicles. Please try again."))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[50vh]"><Loader2 className="size-10 text-primary-light animate-spin" /></div>;

  return (
    <div className="flex flex-col items-center pt-8 pb-16 px-4">
      <div className="w-full max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-light font-bold mb-8 group transition-colors">
          <div className="size-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary-light transition-all">
            <ChevronLeft className="size-5" />
          </div>
          Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-[1.25rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Car className="size-6 text-primary-light" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">My Vehicles</h1>
              <p className="text-sm text-slate-500 font-medium">
                {vehicles.length === 0 ? "No vehicles registered yet" : `${vehicles.length} vehicle${vehicles.length > 1 ? "s" : ""} registered`}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate("/vehicles/add")} className="gap-2 hidden sm:flex">
            <Plus className="size-4" /> Add Vehicle
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm mb-6">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {vehicles.length === 0 ? (
          <div className="glass-card p-12 rounded-[3rem] text-center space-y-4">
            <div className="size-20 rounded-[1.75rem] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto">
              <Car className="size-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">No vehicles yet</h3>
            <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">Add your first vehicle to start offering rides on SaathiRide.</p>
            <Button onClick={() => navigate("/vehicles/add")} className="gap-2 mt-2">
              <Plus className="size-4" /> Add Your First Vehicle
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((v: any) => {
              const style = TYPE_STYLES[v.carType] || { bg: "bg-white/[0.04]", text: "text-slate-400", dot: "bg-slate-400" };
              return (
                <div key={v.id} className="glass-card p-6 rounded-[2rem] hover:border-primary/20 transition-all group relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/[0.05] rounded-full blur-2xl group-hover:bg-primary/[0.1] transition-all pointer-events-none" />
                  <div className="flex items-center justify-between mb-4 relative">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-[1.25rem] bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Car className="size-6 text-primary-light" />
                      </div>
                      <div>
                        <h2 className="text-lg font-display font-bold text-white">{v.carName}</h2>
                        <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                          <span className={`size-1.5 rounded-full ${style.dot}`} />
                          {v.carType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 relative">
                    {[
                      { icon: Hash, label: "Reg. No.", value: v.carNumber },
                      { icon: Users, label: "Seats", value: String(v.totalSeats) },
                      { icon: Layers, label: "Type", value: v.carType },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center gap-1 mb-1">
                          <Icon className="size-3 text-primary-light" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                        </div>
                        <p className="text-sm font-bold text-white truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => navigate("/vehicles/add")}
        className="sm:hidden fixed bottom-6 right-6 size-14 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="size-6" />
      </button>
    </div>
  );
}
