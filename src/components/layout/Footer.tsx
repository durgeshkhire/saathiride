import { MapPin, Phone, Mail, ArrowUpRight, Heart } from "lucide-react";
import { GiElectric } from "react-icons/gi";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    {
      title: "Company",
      items: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Services",
      items: ["Book a Ride", "Offer a Ride", "Intercity Trips", "Corporate"],
    },
    {
      title: "Legal",
      items: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"],
    },
  ];

  return (
    <footer className="relative mt-20 border-t border-white/[0.04] bg-surface text-slate-400">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-accent/[0.02] blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8 relative z-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                <GiElectric className="size-5 text-white" />
              </div>
              <p className="font-display text-xl font-bold text-white tracking-tight">
                SaathiRide
              </p>
            </div>
            <p className="text-sm leading-7 text-slate-500 max-w-xs">
              India's premier carpooling platform. Your trusted journey companion for
              smarter, greener, and more affordable travel.
            </p>
            <div className="flex gap-3">
              {[
                { label: "FB", hoverBg: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/20" },
                { label: "TW", hoverBg: "hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/20" },
                { label: "IG", hoverBg: "hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/20" },
                { label: "LN", hoverBg: "hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-600/20" },
              ].map(({ label, hoverBg }) => (
                <a
                  key={label}
                  href="#"
                  className={`size-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-xs font-bold transition-all border border-white/[0.06] ${hoverBg}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-3">
            {links.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-3.5">
                  {section.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-primary-light transition-colors flex items-center group"
                      >
                        {item}
                        <ArrowUpRight className="size-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: MapPin, title: "HQ Location", value: "GBB Kothrud, Pune 411038" },
            { icon: Phone, title: "Call Support", value: "+91 1800-123-SAATHI" },
            { icon: Mail, title: "Email Us", value: "hello@saathiride.in" },
          ].map(({ icon: Icon, title, value }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-primary/20 hover:bg-white/[0.04] transition-all group"
            >
              <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="size-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
                <p className="text-xs text-slate-500">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600 flex items-center gap-1">
            &copy; {year} SaathiRide Technologies Pvt. Ltd. Made with
            <Heart className="size-3 text-red-400 fill-red-400" />
            in India
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <div className="size-2 rounded-full bg-accent animate-pulse shadow-sm shadow-accent/50" />
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
