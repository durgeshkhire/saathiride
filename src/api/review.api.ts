import api from "./axios";

export const reviewApi = {
  getReviewsForUser: (userId: string) =>
    api.get(`/api/reviews/user/${userId}`),

  getReviewsForRide: (rideId: string) =>
    api.get(`/api/reviews/ride/${rideId}`),

  createReview: (data: {
    revieweeId: string;
    rideId: string;
    rating: number;
    comment?: string;
  }) => api.post("/api/reviews", data),
};
