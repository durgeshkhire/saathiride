import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/api/user.api";
import { reviewApi } from "@/api/review.api";
import {
  UserCircle,
  Mail,
  Calendar,
  Star,
  Car,
  History,
  LogOut,
  Award,
  Shield,
} from "lucide-react";
import Spinner from "@/components/common/Spinner";
import StarRating from "@/components/common/StarRating";
import Button from "@/components/common/Button";
import { formatMonthYear } from "@/utils/formatDate";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  originCity?: string;
  destinationCity?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }

    userApi
      .getMyProfile()
      .then((res) => {
        const data = res.data?.data || res.data;
        setUser(data);
        if (data?.id) {
          return reviewApi.getReviewsForUser(data.id);
        }
      })
      .then((reviewRes: any) => {
        if (reviewRes) {
          const rData = reviewRes.data;
          setReviews(Array.isArray(rData) ? rData : rData?.data || []);
        }
      })
      .catch(() => setError("Unable to load profile."))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[50vh]"><Spinner size="lg" message="Loading your profile..." /></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-16">
      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-5">
          <div className="glass-card p-8 rounded-[3rem] text-center space-y-4 relative overflow-hidden">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

            <div className="size-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto relative">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="rounded-[2rem] w-full h-full object-cover" />
              ) : (
                <UserCircle className="size-14 text-primary-light/60" />
              )}
              <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white ring-4 ring-surface-card">
                <Shield className="size-4" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-display font-bold text-white">{user?.name || "—"}</h1>
              {user?.role && (
                <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary-light border border-primary/20">
                  <Award className="size-3" /> {user.role}
                </span>
              )}
            </div>

            {user?.averageRating ? (
              <div className="flex justify-center">
                <StarRating rating={user.averageRating} showValue size="md" />
              </div>
            ) : null}

            <div className="pt-4 border-t border-white/[0.06] space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Mail className="size-4 text-primary-light" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</p>
                  <p className="text-sm font-semibold text-slate-300">{user?.email || localStorage.getItem("email") || "—"}</p>
                </div>
              </div>
              {user?.createdAt && (
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Calendar className="size-4 text-primary-light" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-semibold text-slate-300">{formatMonthYear(user.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="glass-card p-5 rounded-3xl space-y-2">
            {[
              { label: "My Rides", icon: Car, path: "/rides/my-rides" },
              { label: "My Bookings", icon: History, path: "/bookings" },
              { label: "My Vehicles", icon: Car, path: "/vehicles" },
            ].map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.04] transition-colors text-left group"
              >
                <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="size-4 text-primary-light" />
                </div>
                <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">{label}</span>
              </button>
            ))}
            <div className="h-px bg-white/[0.06] my-1" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 transition-colors text-left"
            >
              <div className="size-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <LogOut className="size-4 text-red-400" />
              </div>
              <span className="font-semibold text-red-400">Logout</span>
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Star className="size-5 text-yellow-400 fill-yellow-400" />
              Reviews ({reviews.length})
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center">
              <div className="size-16 rounded-3xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <Star className="size-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">No reviews yet</h3>
              <p className="text-slate-500 text-sm font-medium">Complete rides to receive your first review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="glass-card p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <UserCircle className="size-5 text-primary-light" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{review.reviewerName}</p>
                        {review.originCity && (
                          <p className="text-[11px] text-slate-500 font-medium">
                            {review.originCity} → {review.destinationCity}
                          </p>
                        )}
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-400 font-medium italic border-l-2 border-primary/30 pl-3">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
