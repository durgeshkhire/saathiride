import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rideApi } from "@/api/ride.api";
import { Ride } from "@/types";
import RideList from "@/components/ride/RideList";
import Button from "@/components/common/Button";
import { Plus } from "lucide-react";

export default function MyRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    rideApi
      .getMyRides()
      .then((res) => {
        const data = res.data;
        let list: Ride[] = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data?.data?.content)) list = data.data.content;
        setRides(list);
      })
      .catch(() => setError("Unable to load your rides."))
      .finally(() => setIsLoading(false));
  }, [navigate]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            <span className="text-white">My </span>
            <span className="text-gradient">Rides.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage and track all the rides you've created.
          </p>
        </div>
        <Button onClick={() => navigate("/rides/create")} className="gap-2">
          <Plus className="size-4" /> Create Ride
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium mb-6">
          {error}
        </div>
      )}

      <RideList
        rides={rides}
        isLoading={isLoading}
        emptyTitle="No rides yet"
        emptyMessage="You haven't created any rides. Start sharing your journey today!"
        showOwnerActions={true}
      />
    </div>
  );
}
