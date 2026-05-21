import RideSearchForm from "@/components/ride/RideSearchForm";

export default function SearchRides() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-16">
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          <span className="text-white">Find Your </span>
          <span className="text-gradient">Ride.</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Search for available rides between cities and book your seat instantly.
        </p>
      </div>
      <RideSearchForm />
    </div>
  );
}
