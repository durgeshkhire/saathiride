import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
} from "lucide-react";
import Button from "@/components/common/Button";

export default function AboutPage() {
  const navigate = useNavigate();

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety",
      description:
        "Every driver profile is rigorously verified with official government IDs and vehicle documentation. Your peace of mind is our absolute priority.",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Users,
      title: "Thriving Community",
      description:
        "We are building a community of verified travelers, fostering connections and making travel more sociable and enjoyable.",
      color: "text-primary-light bg-primary/10 border-primary/20",
    },
    {
      icon: Zap,
      title: "Cost Efficiency",
      description:
        "By sharing the costs of fuel and tolls, carpooling dramatically reduces travel expenses for both drivers and passengers.",
      color: "text-accent bg-accent/10 border-accent/20",
    },
    {
      icon: Compass,
      title: "Eco-Friendly Travel",
      description:
        "Pooling rides reduces the number of vehicles on the road, contributing to lower carbon emissions and cleaner cities across India.",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Search for a Journey",
      desc: "Enter your origin city, destination, and travel date to see available rides along your route.",
    },
    {
      num: "02",
      title: "Select & Book",
      desc: "Compare drivers, ratings, vehicle details, and prices. Select your seat count and request booking.",
    },
    {
      num: "03",
      title: "Travel Together",
      desc: "Get approved, communicate pickup details, track your ride in real-time, and split travel costs.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 space-y-16">
      {/* Hero section */}
      <section className="text-center space-y-6 relative overflow-hidden py-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/[0.08] rounded-full blur-[100px] pointer-events-none" />
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
          <span className="text-white">About </span>
          <span className="text-gradient">SaathiRide.</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
          SaathiRide is India's premium companion carpooling platform, designed to connect commuters and inter-city travelers to share journeys, save costs, and preserve the environment.
        </p>
      </section>

      {/* Grid: Mission and Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.05] rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-4">
            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
              <TrendingUp className="size-6" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Our Mission</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              We aim to make inter-city travel seamless, affordable, and sustainable. By optimizing the occupancy of empty car seats traveling between cities, we seek to reduce traffic congestion, lower the carbon footprint, and provide a reliable community alternative to traditional transit systems.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.05] rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-4">
            <div className="size-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <MapPin className="size-6" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Our Vision</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              Our vision is to build India's largest and most trusted network of ridesharers. Through real-time routing, digital security standards, and smooth payments, we hope to build a culture of cooperative travel where sharing a journey is as natural as driving yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Grid: Core Values */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-white">Why SaathiRide?</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Our platform is built upon four foundational pillars of service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreValues.map((val) => (
            <div
              key={val.title}
              className="glass-card p-6 rounded-3xl flex gap-5 border border-white/[0.06] hover:border-primary/20 transition-colors"
            >
              <div className={`size-12 rounded-2xl border flex items-center justify-center shrink-0 ${val.color}`}>
                <val.icon className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">{val.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="glass-card p-8 md:p-12 rounded-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="relative space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold text-white">How it Works</h2>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              Follow these simple steps to start sharing rides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((st) => (
              <div key={st.num} className="space-y-3 relative group">
                <div className="text-4xl font-display font-extrabold text-primary-light/20 group-hover:text-primary-light/40 transition-colors">
                  {st.num}
                </div>
                <h3 className="text-lg font-bold text-white">{st.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center space-y-6 pt-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
          Ready to Start Your Journey?
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => navigate("/")} size="lg" className="gap-2">
            Find Available Rides <ArrowRight className="size-4" />
          </Button>
          <Button
            onClick={() => navigate(localStorage.getItem("name") ? "/rides/create" : "/auth/login")}
            variant="outline"
            size="lg"
          >
            Offer a Ride
          </Button>
        </div>
      </section>
    </div>
  );
}
