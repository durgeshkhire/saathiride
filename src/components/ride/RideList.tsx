import { Ride } from "@/types";
import RideCard from "./RideCard";
import Spinner from "@/components/common/Spinner";
import { Car } from "lucide-react";
import Button from "@/components/common/Button";

interface RideListProps {
  rides: Ride[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  showOwnerActions?: boolean;
}

export default function RideList({
  rides,
  isLoading = false,
  emptyTitle = "No rides found",
  emptyMessage = "There are no rides matching your criteria.",
  showOwnerActions = false,
}: RideListProps) {
  if (isLoading) {
    return <Spinner size="lg" message="Loading rides..." />;
  }

  if (rides.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-3xl border-dashed border border-white/[0.08]">
        <div className="size-16 rounded-3xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
          <Car className="size-8 text-slate-600" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">{emptyTitle}</h3>
        <p className="text-slate-500 text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride} showOwnerActions={showOwnerActions} />
      ))}
    </div>
  );
}
