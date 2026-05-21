import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  User,
  Car,
  History,
  CarFront,
  Bell,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { GiElectric } from "react-icons/gi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUserName(localStorage.getItem("name"));
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    navigate("/");
  };

  const navLinks = [
    { label: "Book Ride", href: "/" },
    { label: "Create Ride", href: userName ? "/rides/create" : "/auth/login" },
    { label: "About", href: "#" },
  ];

  const profileMenuItems = [
    { label: "My Profile", icon: User, href: "/profile" },
    { label: "My Rides", icon: Car, href: "/rides/my-rides" },
    { label: "My Bookings", icon: History, href: "/bookings" },
    { label: "My Vehicles", icon: CarFront, href: "/vehicles" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => navigate("/")}
        >
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
            <GiElectric className="size-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">
            SaathiRide
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(link.href);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === link.href
                  ? "text-white bg-white/[0.08] shadow-inner"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop User Area */}
        <div className="hidden lg:flex items-center gap-3">
          {userName ? (
            <>
              {/* Notification Bell */}
              <button
                aria-label="Notifications"
                className="relative p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
              >
                <Bell className="size-5 text-slate-400" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent ring-2 ring-surface animate-pulse" />
              </button>

              {/* Profile Popover */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/[0.08]"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Logged in
                    </p>
                    <p className="text-sm font-bold text-white">{userName}</p>
                  </div>
                  <div className="size-8 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center border border-white/[0.08]">
                    <UserCircle className="size-5 text-primary-light" />
                  </div>
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-14 z-20 w-60 bg-surface-card rounded-2xl shadow-2xl shadow-black/40 border border-white/[0.08] p-2 animate-slide-up">
                      <div className="px-3 py-2.5 mb-1 border-b border-white/[0.06]">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          Account
                        </p>
                        <p className="text-sm font-bold text-white">{userName}</p>
                      </div>
                      {profileMenuItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            navigate(item.href);
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-primary-light transition-colors"
                        >
                          <item.icon className="size-4 text-slate-500" />
                          {item.label}
                        </button>
                      ))}
                      <div className="h-px bg-white/[0.06] my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="h-9 px-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="size-5 text-white" />
          ) : (
            <Menu className="size-5 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-surface-card/95 backdrop-blur-2xl border-t border-white/[0.06] px-4 py-4 space-y-1 animate-slide-up">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(link.href);
              }}
              className="flex items-center h-12 px-4 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-primary-light transition-colors"
            >
              {link.label}
            </a>
          ))}

          {userName ? (
            <>
              <div className="pt-2 border-t border-white/[0.06] mt-2">
                <div className="px-4 py-2 mb-2">
                  <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest">
                    Logged in as
                  </p>
                  <p className="text-sm font-bold text-white">{userName}</p>
                </div>
                {profileMenuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.href)}
                    className="w-full flex items-center gap-3 h-12 px-4 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-primary-light transition-colors"
                  >
                    <item.icon className="size-4 text-slate-500" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 h-12 px-4 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-bold hover:opacity-90 transition-colors mt-2 shadow-lg shadow-primary/20"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
