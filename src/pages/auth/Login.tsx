import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/common/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);
      const { token, name, email: userEmail, role } = response.data;
      setAuth({ token, name, email: userEmail, role });
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-bold">
            <Sparkles className="size-3" />
            Welcome back
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight leading-tight">
            <span className="text-white">Sign </span>
            <span className="text-gradient">In.</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Enter your credentials to access your account.
          </p>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.08] rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium animate-slide-up">
              <AlertCircle className="size-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all hover:border-primary/30 placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-primary-light hover:text-white transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all hover:border-primary/30 placeholder:text-slate-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Sign In <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/[0.06] pt-6">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/auth/register")}
                className="font-bold text-primary-light hover:text-white transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
