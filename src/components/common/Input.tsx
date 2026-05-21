import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 flex items-center pointer-events-none text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={[
              "w-full h-12 rounded-2xl border bg-white/[0.04] text-white font-medium text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all",
              "placeholder:text-slate-600",
              icon ? "pl-11" : "pl-4",
              "pr-4",
              error
                ? "border-red-500/30 focus:ring-red-500/30"
                : "border-white/[0.08] hover:border-primary/30",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-[11px] text-slate-600 font-medium pl-1">{hint}</p>
        )}
        {error && (
          <p className="text-[11px] text-red-400 font-semibold pl-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
