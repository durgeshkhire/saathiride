import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { authApi } from "@/api/auth.api";
import Button from "@/components/common/Button";

interface VerifyOtpProps {
  email?: string;
}

export default function VerifyOtp({ email: defaultEmail = "" }: VerifyOtpProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.verifyOtp(email, otp);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/auth/register"), 1500);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold">
            <span className="text-white">Verify </span>
            <span className="text-gradient">Identity.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Enter the OTP sent to your email.
          </p>
        </div>

        <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium">
              <AlertCircle className="size-5 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3 text-accent text-sm font-medium">
              <CheckCircle2 className="size-5 shrink-0" />
              Email verified! Redirecting...
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                OTP Code
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-mono tracking-[0.3em] text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-slate-600"
                />
              </div>
            </div>
            <Button type="submit" isLoading={isLoading} fullWidth size="lg">
              Verify OTP <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
