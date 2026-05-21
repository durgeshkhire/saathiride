export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverAvatarUrl?: string;
  driverRating: number;
  vehicleId: string;
  carName: string;
  carNumber: string;
  carType: string;
  vehicleTotalSeats: number;
  originCity: string;
  destinationCity: string;
  originAddress: string;
  destinationAddress: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  description?: string;
  instantBooking: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  rideId: string;
  originCity: string;
  destinationCity: string;
  departureTime: string;
  carName: string;
  carNumber: string;
  riderId: string;
  riderName: string;
  riderEmail: string;
  seatsRequested: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  pickupNote?: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  carName: string;
  carNumber: string;
  carType: string;
  totalSeats: number;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  revieweeName: string;
  rideId: string;
  originCity: string;
  destinationCity: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
}
