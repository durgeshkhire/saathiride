import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingApi } from "@/api/booking.api";
import { rideApi } from "@/api/ride.api";
import {
  ChevronLeft,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/common/Button";
import Spinner from "@/components/common/Spinner";
import { format } from "date-fns";

interface BookingRequest {
  id: string;
  riderName: string;
  seatsRequested: number;
  pickupNote?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
}

export default function MyRidesManage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !id) { navigate("/auth/login"); return; }

    Promise.all([rideApi.getRideById(id), bookingApi.getBookingsForRide(id)])
      .then(([rideRes, bookingRes]) => {
        setRide(rideRes.data?.data || rideRes.data);
        const data = bookingRes.data;
        setBookings(data?.data && Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Unable to load booking requests for this ride."))
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleResponse = async (bookingId: string, action: "approve" | "cancel") => {
    try {
      if (action === "approve") await bookingApi.approveBooking(bookingId);
      else await bookingApi.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: action === "approve" ? "APPROVED" : "REJECTED" } : b
        )
      );
    } catch (err: any) {
      console.error(`Error ${action} booking:`, err);
    }
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[50vh]"><Spinner size="lg" message="Loading requests..." /></div>;

  return (
    <div className="mx-auto max-w-5xl w-full px-4 pt-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-light font-bold mb-8 group transition-colors"
      >
        <div className="size-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
          <ChevronLeft className="size-5" />
        </div>
        Back
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight">
          <span className="text-white">Manage </span>
          <span className="text-gradient">Requests.</span>
        </h1>
        {ride && (
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mt-1">
            <MapPin className="size-3.5" /> {ride.originCity}
            <span>→</span>
            {ride.destinationCity}
            <span className="mx-1 text-slate-700">|</span>
            <Calendar className="size-3.5" /> {new Date(ride.departureTime).toLocaleDateString()}
          </div>
        )}
      </div>

      {error ? (
        <div className="p-6 glass-card rounded-3xl text-center">
          <AlertCircle className="size-12 text-red-400 mx-auto mb-3" />
          <p className="font-bold text-white">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center p-16 glass-card rounded-3xl border-dashed border border-white/[0.08]">
          <Clock className="size-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-white mb-2">No requests yet</h3>
          <p className="text-slate-500 font-medium text-sm">Requests will appear here when passengers book your ride.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-card p-6 rounded-3xl hover:border-primary/20 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  <div className="size-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Users className="size-7 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{booking.riderName}</p>
                    <p className="text-sm text-slate-500 font-medium">
                      Requesting <span className="font-bold text-slate-300">{booking.seatsRequested} {booking.seatsRequested === 1 ? "seat" : "seats"}</span>
                    </p>
                    {booking.pickupNote && (
                      <div className="mt-2 flex items-start gap-2 p-3 bg-primary/[0.06] rounded-xl border border-primary/10 max-w-sm">
                        <MessageSquare className="size-3.5 text-primary-light mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mb-0.5">Pickup Note</p>
                          <p className="text-xs text-slate-500 italic">"{booking.pickupNote}"</p>
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-600 mt-2">Requested {format(new Date(booking.requestedAt), "MMM d, hh:mm a")}</p>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  {booking.status === "PENDING" ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResponse(booking.id, "cancel")}
                        className="!text-red-400 hover:!bg-red-500/10 gap-2"
                      >
                        <XCircle className="size-4" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleResponse(booking.id, "approve")}
                        className="gap-2"
                      >
                        <CheckCircle2 className="size-4" /> Accept
                      </Button>
                    </>
                  ) : (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest border ${booking.status === "APPROVED" ? "bg-accent/10 text-accent border-accent/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      {booking.status === "APPROVED" ? <><CheckCircle2 className="size-3.5" /> Approved</> : <><XCircle className="size-3.5" /> Rejected</>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
