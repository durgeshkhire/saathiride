import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "dark" | "outline";
  padding?: "sm" | "md" | "lg" | "xl";
}

const variantClasses = {
  glass:
    "bg-surface-card/70 backdrop-blur-2xl border border-white/[0.06] shadow-xl shadow-black/20",
  dark: "bg-surface-light border border-white/[0.04] text-white",
  outline: "border border-white/[0.08] bg-white/[0.02]",
};

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8 md:p-10",
  xl: "p-8 md:p-12",
};

export default function Card({
  variant = "glass",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-[2.5rem] relative overflow-hidden transition-all duration-300",
        variantClasses[variant],
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
