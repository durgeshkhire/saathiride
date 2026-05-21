import api from "./axios";

export const rideApi = {
  searchRides: (params: {
    originCity: string;
    destinationCity: string;
    departureDate: string;
    seats: number;
  }) => api.get("/api/rides/search", { params }),

  getAllRides: () => api.get("/api/rides"),

  getRideById: (id: string) => api.get(`/api/rides/${id}`),

  getMyRides: () => api.get("/api/rides/my-rides"),

  createRide: (data: {
    vehicleId: number | string;
    originCity: string;
    originAddress: string;
    originLat: number;
    originLng: number;
    destinationCity: string;
    destinationAddress: string;
    destinationLat: number;
    destinationLng: number;
    departureTime: string;
    totalSeats: number;
    pricePerSeat: number;
    instantBooking: boolean;
  }) => api.post("/api/rides", data),

  cancelRide: (id: string) => api.patch(`/api/rides/${id}/cancel`),

  startRide: (id: string) => api.patch(`/api/rides/${id}/start`),

  completeRide: (id: string) => api.patch(`/api/rides/${id}/complete`),
};
