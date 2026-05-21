import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rideApi } from "@/api/ride.api";
import { bookingApi } from "@/api/booking.api";
import {
  ChevronLeft,
  Users,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";

export default function RequestBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [pickupNote, setPickupNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    rideApi.getRideById(id)
      .then((res) => setRide(res.data?.data || res.data))
      .catch(() => setError("Could not fetch ride details."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { setError("Please login to book a ride."); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      await bookingApi.createBooking({ rideId: id!, seatsRequested, pickupNote });
      setSuccess(true);
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[50vh]"><Spinner size="lg" message="Preparing your booking..." /></div>;

  const pricePerSeat = ride?.pricePerSeat ?? ride?.price ?? 0;
  const total = seatsRequested * pricePerSeat;

  return (
    <div className="flex flex-col items-center pt-8 pb-16 px-4">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-light font-bold mb-8 group transition-colors"
        >
          <div className="size-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
            <ChevronLeft className="size-5" />
          </div>
          Back to Details
        </button>

        {/* Success overlay */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="glass-card p-10 rounded-[3rem] text-center space-y-4 max-w-xs mx-4">
              <div className="size-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-10 text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Booking Requested!</h2>
              <p className="text-slate-400 text-sm">Your request has been sent. Check My Bookings for status.</p>
            </div>
          </div>
        )}

        <div className="glass-card p-8 md:p-10 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.08] rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

          <div className="relative mb-8">
            <h1 className="text-2xl font-display font-bold text-white mb-1">Confirm Your Booking</h1>
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
              <span>{ride?.originCity}</span>
              <ArrowRight className="size-4" />
              <span>{ride?.destinationCity}</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
              <AlertCircle className="size-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-8">
            {/* Seat selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                <Users className="size-3.5 text-primary" /> Number of Seats
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {Array.from({ length: ride?.availableSeats || 1 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSeatsRequested(i + 1)}
                    className={`h-12 rounded-2xl font-bold transition-all border text-sm ${
                      seatsRequested === i + 1
                        ? "bg-primary text-white border-primary shadow-md scale-105"
                        : "bg-white/[0.04] border-white/[0.06] text-slate-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">
                {ride?.availableSeats} seat{ride?.availableSeats !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Pickup note */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                <MessageSquare className="size-3.5 text-primary" /> Pickup Note (Optional)
              </label>
              <textarea
                placeholder="e.g. I'll be waiting near the main gate with a blue bag."
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
                className="w-full min-h-[100px] px-4 py-3 rounded-3xl border border-white/[0.08] bg-white/[0.04] text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none placeholder:text-slate-600"
              />
            </div>

            {/* Price summary */}
            <div className="p-6 rounded-3xl bg-surface-card text-white relative overflow-hidden border border-white/[0.06]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/[0.15] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="relative">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price Summary</p>
                    <p className="text-sm text-slate-300">{seatsRequested} Seat{seatsRequested !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-light flex items-center">
                      <IndianRupee className="size-5" />{total}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold">Total Fare</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="size-4 text-green-500" />
                  Driver info shared after booking approval
                </div>
              </div>
            </div>

            <Button type="submit" isLoading={isSubmitting} fullWidth size="lg" className="text-lg shadow-xl shadow-primary/30">
              Confirm Booking Request <ArrowRight className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
