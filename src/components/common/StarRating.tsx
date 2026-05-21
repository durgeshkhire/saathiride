import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number | null;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const starClass = sizeClasses[size];
  const safeRating = typeof rating === 'number' ? rating : 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.round(safeRating);
        return (
          <Star
            key={i}
            className={[
              starClass,
              filled ? "text-yellow-400 fill-yellow-400" : "text-slate-700 fill-slate-700",
              interactive ? "cursor-pointer hover:scale-110 transition-transform" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
          />
        );
      })}
      {showValue && (
        <span className="text-sm font-bold text-slate-300 ml-1">
          {safeRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
