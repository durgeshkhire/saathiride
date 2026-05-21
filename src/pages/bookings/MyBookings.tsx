import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookingApi } from "@/api/booking.api";
import { Booking } from "@/types";
import BookingCard from "@/components/booking/BookingCard";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";
import { Calendar, ArrowRight, AlertCircle } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }

    bookingApi
      .getMyBookings()
      .then((res) => {
        const data = res.data;
        let list: Booking[] = [];
        if (data?.success && Array.isArray(data.data)) list = data.data;
        else if (Array.isArray(data)) list = data;
        setBookings(list);
      })
      .catch(() => setError("Unable to load your bookings."))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[50vh]"><Spinner size="lg" message="Fetching your bookings..." /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            <span className="text-white">My </span>
            <span className="text-gradient">Bookings.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track your requested rides and their status.</p>
        </div>
        <Button onClick={() => navigate("/")} className="gap-2">
          Book More Rides <ArrowRight className="size-4" />
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium mb-6">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {bookings.length === 0 && !isLoading ? (
        <div className="text-center py-20 glass-card rounded-3xl border-dashed border border-white/[0.08]">
          <div className="size-16 rounded-3xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Calendar className="size-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2">No bookings yet</h3>
          <p className="text-slate-500 font-medium text-sm mb-6">Browse available rides and book your first journey!</p>
          <Button onClick={() => navigate("/")}>Browse Rides</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  );
}
