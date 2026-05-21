import api from "./axios";

export const userApi = {
  getMyProfile: () => api.get("/api/users/me"),

  getProfileById: (userId: string) => api.get(`/api/users/${userId}`),

  updateProfile: (data: { name?: string; bio?: string }) =>
    api.put("/api/users/me", data),
};
