import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleApi } from "@/api/vehicle.api";
import {
  Car,
  Hash,
  Layers,
  Users,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/common/Button";

interface VehicleForm {
  carName: string;
  carNumber: string;
  carType: string;
  totalSeats: number | "";
}

const CAR_TYPES = ["SEDAN", "SUV", "HATCHBACK"] as const;

export default function AddVehicle() {
  const navigate = useNavigate();
  const [form, setForm] = useState<VehicleForm>({ carName: "", carNumber: "", carType: "", totalSeats: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.carName.trim()) errs.carName = "Car name is required";
    if (!form.carNumber.trim()) errs.carNumber = "Car number is required";
    if (!form.carType) errs.carType = "Car type is required";
    const seats = Number(form.totalSeats);
    if (form.totalSeats === "") errs.totalSeats = "Total seats is required";
    else if (seats < 1 || seats > 7) errs.totalSeats = "Must be between 1 – 7";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "totalSeats" ? (value === "" ? "" : Number(value)) : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }

    setIsSubmitting(true);
    setApiError(null);
    try {
      await vehicleApi.addVehicle({
        carName: form.carName.trim(),
        carNumber: form.carNumber.trim().toUpperCase(),
        carType: form.carType,
        totalSeats: Number(form.totalSeats),
      });
      setSuccessMsg("Vehicle added successfully!");
      setForm({ carName: "", carNumber: "", carType: "", totalSeats: "" });
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to add vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full h-12 pl-12 pr-4 rounded-2xl border bg-white/[0.04] text-white font-medium text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-600 ${
      hasError ? "border-red-500/30 focus:ring-red-500/30" : "border-white/[0.08] focus:ring-primary/40 hover:border-primary/30"
    }`;

  return (
    <div className="flex flex-col items-center pt-8 pb-16 px-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary-light font-bold mb-8 group transition-colors">
          <div className="size-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
            <ChevronLeft className="size-5" />
          </div>
          Back
        </button>

        <div className="glass-card p-8 md:p-10 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.08] rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="size-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Car className="size-8 text-primary-light" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Add Vehicle</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Register your vehicle to offer rides</p>
          </div>

          {successMsg && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-semibold mb-5">
              <CheckCircle2 className="size-5 shrink-0" />
              {successMsg}
            </div>
          )}
          {apiError && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold mb-5">
              <AlertCircle className="size-5 shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Car Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Car Name</label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary-light" />
                <input name="carName" placeholder="e.g. Honda City" value={form.carName} onChange={handleChange} className={inputCls(!!errors.carName)} />
              </div>
              {errors.carName && <p className="text-[11px] text-red-400 font-semibold pl-1">{errors.carName}</p>}
            </div>

            {/* Car Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Car Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary-light" />
                <input name="carNumber" placeholder="e.g. MH12AB1234" value={form.carNumber} onChange={handleChange} className={`${inputCls(!!errors.carNumber)} uppercase`} />
              </div>
              {errors.carNumber && <p className="text-[11px] text-red-500 font-semibold pl-1">{errors.carNumber}</p>}
            </div>

            {/* Car Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Car Type</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary-light" />
                <select name="carType" value={form.carType} onChange={handleChange} className={`${inputCls(!!errors.carType)} appearance-none cursor-pointer`}>
                  <option value="" disabled hidden>Select car type</option>
                  {CAR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {errors.carType && <p className="text-[11px] text-red-500 font-semibold pl-1">{errors.carType}</p>}
            </div>

            {/* Total Seats */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Total Seats</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary-light" />
                <input name="totalSeats" type="number" min={1} max={7} placeholder="e.g. 4" value={form.totalSeats} onChange={handleChange} className={inputCls(!!errors.totalSeats)} />
              </div>
              {errors.totalSeats && <p className="text-[11px] text-red-500 font-semibold pl-1">{errors.totalSeats}</p>}
            </div>

            {/* Quick seat picker */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Quick Select Seats</p>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setForm((p) => ({ ...p, totalSeats: n })); setErrors((p) => ({ ...p, totalSeats: undefined })); }}
                    className={`size-10 rounded-xl font-bold text-sm transition-all ${form.totalSeats === n ? "bg-primary text-white shadow-md scale-105" : "bg-white/[0.06] text-slate-400 hover:bg-primary/10 hover:text-primary-light border border-white/[0.06]"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" isLoading={isSubmitting} fullWidth size="lg" className="gap-2 mt-2">
              <Car className="size-4" /> Add Vehicle
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
