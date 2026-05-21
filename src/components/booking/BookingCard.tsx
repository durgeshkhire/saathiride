import { useNavigate } from "react-router-dom";
import { Booking } from "@/types";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  Car,
} from "lucide-react";

interface BookingCardProps {
  booking: Booking;
}

const STATUS_CONFIG = {
  PENDING: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    icon: Clock3,
  },
  APPROVED: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20",
    icon: CheckCircle2,
  },
  REJECTED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    icon: XCircle,
  },
  CANCELLED: {
    bg: "bg-white/[0.04]",
    text: "text-slate-400",
    border: "border-white/[0.06]",
    icon: XCircle,
  },
};

export default function BookingCard({ booking }: BookingCardProps) {
  const navigate = useNavigate();
  const statusConf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusConf.icon;

  const formattedDeparture = booking.departureTime?.includes("T")
    ? format(new Date(booking.departureTime), "MMM d, hh:mm a")
    : booking.departureTime;

  return (
    <div className="group glass-card p-6 rounded-3xl hover:border-primary/20 transition-all flex flex-col justify-between relative overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
            <Car className="size-6 text-primary-light group-hover:text-white transition-colors" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
          >
            <StatusIcon className="size-3" />
            {booking.status}
          </span>
        </div>

        {/* Route */}
        <div className="relative flex flex-col gap-4 mb-5 pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/[0.06] group-hover:bg-gradient-to-b group-hover:from-primary/40 group-hover:to-accent/20 transition-all" />
          <div>
            <div className="absolute left-0 size-4 rounded-full border-2 border-primary bg-surface-card" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">From</p>
            <p className="font-bold text-white">{booking.originCity}</p>
          </div>
          <div>
            <div className="absolute left-0 bottom-0 size-4 rounded-full border-2 border-accent bg-surface-card" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">To</p>
            <p className="font-bold text-white">{booking.destinationCity}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Vehicle</p>
            <p className="text-sm font-bold text-white">{booking.carName}</p>
            <p className="text-[11px] text-slate-500">{booking.carNumber}</p>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Seats</p>
            <p className="text-sm font-bold text-white">
              {booking.seatsRequested} Seat{booking.seatsRequested !== 1 ? "s" : ""}
            </p>
            <p className="text-[11px] text-slate-500">Requested</p>
          </div>
        </div>

        {booking.pickupNote && (
          <div className="mb-5 p-3 bg-primary/[0.06] rounded-2xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mb-0.5">Pickup Note</p>
            <p className="text-xs text-slate-400 italic">"{booking.pickupNote}"</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary-light" />
          <p className="text-sm font-bold text-white">{formattedDeparture}</p>
        </div>
        <button
          onClick={() => navigate(`/rides/${booking.rideId}`)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary-light hover:text-white transition-colors group/btn"
        >
          View Ride <ArrowRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
