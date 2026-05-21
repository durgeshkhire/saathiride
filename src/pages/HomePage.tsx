import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rideApi } from "@/api/ride.api";
import RideSearchForm from "@/components/ride/RideSearchForm";
import RideCard from "@/components/ride/RideCard";
import { Ride } from "@/types";
import {
  ArrowRight,
  MapPin,
  Shield,
  Users,
  Zap,
  TrendingUp,
  Globe,
  Star,
} from "lucide-react";

const HEADLINES = [
  "Find Your Ride. Share Your Journey.",
  "Connecting Commuters Across India",
  "Travel Together, Arrive Better.",
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [ridesLoading, setRidesLoading] = useState(true);

  // Rotating headline
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HEADLINES.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch upcoming rides
  useEffect(() => {
    rideApi
      .getAllRides()
      .then((res) => {
        const data = res.data;
        let list: Ride[] = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data?.data?.content)) list = data.data.content;
        setUpcomingRides(list.slice(0, 6));
      })
      .catch(() => setUpcomingRides([]))
      .finally(() => setRidesLoading(false));
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Safe & Verified",
      desc: "All drivers are verified with government ID. Your safety is our highest priority.",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary-light",
    },
    {
      icon: Users,
      title: "Share & Save",
      desc: "Share your ride, split costs, and meet new people on every trip you take.",
      gradient: "from-accent/20 to-accent/5",
      iconColor: "text-accent-light",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      desc: "Find and book rides in seconds with real-time seat availability & tracking.",
      gradient: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-400",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Riders", icon: TrendingUp },
    { value: "120+", label: "Cities", icon: Globe },
    { value: "4.8", label: "Avg Rating", icon: Star },
  ];

  return (
    <div className="relative">
      {/* ─── HERO SECTION ─── */}
      <section className="relative mx-auto max-w-7xl px-4 pt-12 md:pt-20 pb-8 overflow-hidden">
        {/* Hero glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/[0.12] rounded-full blur-[150px] pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-bold uppercase tracking-wider animate-slide-up">
              <Zap className="size-3 fill-current" />
              India's #1 Carpooling Platform
            </div>

            {/* Animated headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1]"
              style={{ minHeight: "7rem" }}
            >
              <span
                key={currentIndex}
                style={{
                  display: "inline-block",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? "translateY(20px)" : "translateY(0)",
                }}
                className="text-gradient-hero"
              >
                {HEADLINES[currentIndex]}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Your journey companion is here.{" "}
              <span className="text-primary-light font-bold">Book</span> or{" "}
              <span className="text-accent font-bold">offer</span> a ride today
              and travel smarter.
            </p>

            {/* Dot indicators */}
            <div className="flex justify-center lg:justify-start gap-2">
              {HEADLINES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentIndex(i);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  style={{
                    width: i === currentIndex ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    background:
                      i === currentIndex
                        ? "linear-gradient(90deg, #6C3CE1, #14B8A6)"
                        : "rgba(148, 163, 184, 0.2)",
                    border: "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="size-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Icon className="size-4 text-primary-light" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white leading-none">{value}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Cars Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Glow behind illustration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 bg-primary/[0.15] rounded-full blur-[80px]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 bg-accent/[0.1] rounded-full blur-[60px] translate-x-12 translate-y-8" />
            </div>

            {/* Cars SVG */}
            <div className="relative animate-float">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <img
                  src="/cars.svg"
                  alt="Carpooling illustration"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(108, 60, 225, 0.3)) drop-shadow(0 0 80px rgba(108, 60, 225, 0.15))",
                  }}
                />
              </div>

              {/* Floating badge cards */}
              <div className="absolute -top-2 -left-4 sm:left-0 px-3 py-2 rounded-xl bg-surface-card/90 backdrop-blur-xl border border-white/[0.08] shadow-xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Shield className="size-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Verified</p>
                    <p className="text-xs font-bold text-white">100% Safe</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 -right-2 sm:right-4 px-3 py-2 rounded-xl bg-surface-card/90 backdrop-blur-xl border border-white/[0.08] shadow-xl animate-slide-up" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Users className="size-4 text-primary-light" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Community</p>
                    <p className="text-xs font-bold text-white">50K+ Riders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH FORM ─── */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <RideSearchForm />
      </section>

      {/* ─── FEATURES ─── */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold text-primary-light uppercase tracking-[0.2em]">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Travel with <span className="text-gradient">Confidence</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            We're building the future of shared mobility in India with safety, convenience, and community at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, gradient, iconColor }, idx) => (
            <div
              key={title}
              className="glass-card p-7 rounded-3xl text-center space-y-4 hover:border-primary/20 transition-all group relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {/* Background glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className="size-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto group-hover:border-primary/20 group-hover:bg-white/[0.06] transition-all">
                  <Icon className={`size-8 ${iconColor} transition-transform group-hover:scale-110`} />
                </div>
                <h3 className="text-lg font-display font-bold text-white mt-4">{title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── UPCOMING RIDES ─── */}
      {(ridesLoading || upcomingRides.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 py-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="size-4 text-primary-light" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Upcoming Rides
                </h2>
              </div>
              <p className="text-sm text-slate-500 font-medium ml-10">
                Find rides across all popular routes
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm font-bold text-primary-light hover:text-white transition-colors group"
            >
              View All{" "}
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {ridesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="glass-card h-60 rounded-3xl animate-shimmer"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
