import api from "./axios";

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  sendOtp: (email: string) =>
    api.post("/auth/send-otp", { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post("/auth/verify-otp", { email, otp }),

  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
};
