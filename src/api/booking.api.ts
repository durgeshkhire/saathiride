import api from "./axios";

export const bookingApi = {
  createBooking: (data: {
    rideId: string;
    seatsRequested: number;
    pickupNote?: string;
  }) => api.post("/api/bookings", data),

  getMyBookings: () => api.get("/api/bookings/my-bookings"),

  getBookingsForRide: (rideId: string) =>
    api.get(`/api/bookings/ride/${rideId}`),

  approveBooking: (bookingId: string) =>
    api.patch(`/api/bookings/${bookingId}/approve`),

  cancelBooking: (bookingId: string) =>
    api.patch(`/api/bookings/${bookingId}/cancel`),
};
