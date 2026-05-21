import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { authApi } from "@/api/auth.api";
import Button from "@/components/common/Button";

type Step = "EMAIL" | "OTP" | "DETAILS";

export default function Register() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const stepProgress = { EMAIL: "33.33%", OTP: "66.66%", DETAILS: "100%" }[step];

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.sendOtp(email);
      if (res.data.success) {
        setSuccessMsg(res.data.message || "OTP sent successfully!");
        setStep("OTP");
      } else {
        setError(res.data.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.verifyOtp(email, otp);
      if (res.data.success) {
        setSuccessMsg("Email verified! Fill in your details.");
        setStep("DETAILS");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(name, email, password);
      setSuccessMsg("Account created! Redirecting to login...");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    "w-full h-12 pl-11 pr-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all hover:border-primary/30 placeholder:text-slate-600";

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl font-display font-bold tracking-tight leading-tight">
            {step === "EMAIL" && <><span className="text-white">Create </span><span className="text-gradient">account.</span></>}
            {step === "OTP" && <><span className="text-white">Verify </span><span className="text-gradient">identity.</span></>}
            {step === "DETAILS" && <><span className="text-white">Final </span><span className="text-gradient">details.</span></>}
          </h1>
          <p className="text-slate-500 font-medium">
            {step === "EMAIL" && "Join SaathiRide and start your journey today."}
            {step === "OTP" && "We've sent a verification code to your email."}
            {step === "DETAILS" && "Almost there! Provide your details to finish."}
          </p>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/[0.04] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-in-out"
              style={{ width: stepProgress }}
            />
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
              <AlertCircle className="size-5 shrink-0" />
              {error}
            </div>
          )}
          {successMsg && !error && (
            <div className="mb-5 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3 text-accent text-sm font-medium">
              <CheckCircle2 className="size-5 shrink-0" />
              {successMsg}
            </div>
          )}

          {step === "EMAIL" && (
            <form onSubmit={handleSendOtp} className="space-y-5 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
              </div>
              <Button type="submit" isLoading={isLoading} fullWidth size="lg">
                Next <ArrowRight className="size-4" />
              </Button>
            </form>
          )}

          {step === "OTP" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 mt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("EMAIL")}
                    className="text-xs font-bold text-primary-light hover:text-white transition-colors"
                  >
                    Edit Email
                  </button>
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                  <input
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className={`${inputCls} tracking-[0.3em] font-mono text-lg`}
                  />
                </div>
                <p className="text-xs text-slate-500 text-center mt-1">
                  Code sent to <span className="font-bold text-white">{email}</span>
                </p>
              </div>
              <Button type="submit" isLoading={isLoading} fullWidth size="lg">
                Verify OTP <ShieldCheck className="size-4" />
              </Button>
            </form>
          )}

          {step === "DETAILS" && (
            <form onSubmit={handleRegister} className="space-y-5 mt-2">
              {[
                { label: "Full Name", icon: User, value: name, setter: setName, type: "text", placeholder: "Your Name" },
                { label: "Password", icon: Lock, value: password, setter: setPassword, type: "password", placeholder: "••••••••" },
                { label: "Confirm Password", icon: Lock, value: confirmPassword, setter: setConfirmPassword, type: "password", placeholder: "••••••••" },
              ].map(({ label, icon: Icon, value, setter, type, placeholder }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
              <Button type="submit" isLoading={isLoading} fullWidth size="lg">
                Create Account <CheckCircle2 className="size-4" />
              </Button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-white/[0.06] pt-6">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="font-bold text-primary-light hover:text-white transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
