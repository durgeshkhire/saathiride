import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

const sizeClasses = {
  sm: "size-5",
  md: "size-8",
  lg: "size-12",
};

export default function Spinner({ size = "md", message }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-primary-light animate-spin`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-primary/20 rounded-full blur-lg`} />
      </div>
      {message && (
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
