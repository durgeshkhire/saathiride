import api from "./axios";

export const vehicleApi = {
  getMyVehicles: () => api.get("/api/vehicles/my-vehicles"),

  addVehicle: (data: {
    carName: string;
    carNumber: string;
    carType: string;
    totalSeats: number;
  }) => api.post("/api/vehicles", data),

  deleteVehicle: (id: string) => api.delete(`/api/vehicles/${id}`),
};
