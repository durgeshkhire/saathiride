import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, IndianRupee, Zap } from "lucide-react";
import { Ride } from "@/types";
import { formatDate, formatTime } from "@/utils/formatDate";
import StarRating from "@/components/common/StarRating";
import Button from "@/components/common/Button";
import { rideApi } from "@/api/ride.api";

interface RideCardProps {
  ride: Ride;
  showOwnerActions?: boolean;
}

export default function RideCard({ ride, showOwnerActions }: RideCardProps) {
  const navigate = useNavigate();

  const statusColors: Record<string, string> = {
    UPCOMING: "bg-accent/20 text-accent border-accent/20",
    ONGOING: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    COMPLETED: "bg-white/[0.06] text-slate-400 border-white/[0.06]",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/20",
  };

  return (
    <div
      onClick={() => navigate(`/rides/${ride.id}`)}
      className="group glass-card p-6 rounded-3xl hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              <Zap className="size-5 text-primary-light group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{ride.driverName}</p>
              <StarRating rating={ride.driverRating} size="sm" showValue />
            </div>
          </div>
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
              statusColors[ride.status] || "bg-white/[0.06] text-slate-400 border-white/[0.06]"
            }`}
          >
            {ride.status}
          </span>
        </div>

        {/* Route */}
        <div className="relative flex flex-col gap-3 mb-5 pl-6">
          <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-white/[0.06] group-hover:bg-gradient-to-b group-hover:from-primary/50 group-hover:to-accent/30 transition-all" />
          <div>
            <div className="absolute left-0 size-4 rounded-full border-2 border-primary bg-surface-card" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              From
            </p>
            <p className="font-bold text-white text-base">{ride.originCity}</p>
          </div>
          <div>
            <div className="absolute left-0 bottom-0 size-4 rounded-full border-2 border-accent bg-surface-card group-hover:border-accent transition-colors" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              To
            </p>
            <p className="font-bold text-white text-base">{ride.destinationCity}</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5 text-primary-light" />
              {formatDate(ride.departureTime)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-primary-light" />
              {formatTime(ride.departureTime)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5 text-accent" />
              {ride.availableSeats} left
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary-light font-bold text-lg">
            <IndianRupee className="size-4" />
            {ride.pricePerSeat}
          </div>
        </div>

        {/* Owner Actions */}
        {showOwnerActions && ride.status !== "CANCELLED" && ride.status !== "COMPLETED" && (
          <div className="pt-4 mt-2 border-t border-white/[0.06] flex gap-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rides/manage/${ride.id}`);
              }}
            >
              Manage
            </Button>
            {ride.status === "UPCOMING" && (
              <Button
                size="sm"
                className="flex-1"
                onClick={async (e) => {
                  e.stopPropagation();
                  const isToday = new Date(ride.departureTime).toDateString() === new Date().toDateString();
                  if (!isToday) {
                    alert(`Ride is on ${formatDate(ride.departureTime)}. Cannot start before.`);
                    return;
                  }
                  try {
                    await rideApi.startRide(ride.id);
                    navigate(`/rides/${ride.id}`);
                  } catch (err) {
                    console.error(err);
                    alert("Failed to start ride.");
                  }
                }}
              >
                Start
              </Button>
            )}
            {ride.status === "ONGOING" && (
              <Button
                size="sm"
                className="flex-1 !bg-gradient-to-r !from-accent !to-teal-600 !shadow-accent/20"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/rides/track/${ride.id}`);
                }}
              >
                Track Ride
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
