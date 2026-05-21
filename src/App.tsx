import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/common/ScrollToTop";

// Pages
import HomePage from "@/pages/HomePage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import SearchRides from "@/pages/rides/SearchRides";
import MyRides from "@/pages/rides/MyRides";
import CreateRide from "@/pages/rides/CreateRide";
import RideDetailsPage from "@/pages/rides/RideDetailsPage";
import MyRidesManage from "@/pages/rides/MyRidesManage";
import MyBookings from "@/pages/bookings/MyBookings";
import RequestBookingPage from "@/pages/bookings/RequestBookingPage";
import MyVehicles from "@/pages/vehicles/MyVehicles";
import AddVehicle from "@/pages/vehicles/AddVehicle";
import Profile from "@/pages/profile/Profile";
import TrackRide from "@/pages/rides/TrackRide";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth routes (no footer) */}
        <Route
          path="/auth/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/auth/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/auth/verify-otp"
          element={
            <Layout>
              <VerifyOtp />
            </Layout>
          }
        />

        {/* Main routes */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchRides />
            </Layout>
          }
        />

        {/* Rides */}
        <Route
          path="/rides/create"
          element={
            <Layout>
              <CreateRide />
            </Layout>
          }
        />
        <Route
          path="/rides/my-rides"
          element={
            <Layout>
              <MyRides />
            </Layout>
          }
        />
        <Route
          path="/rides/:id"
          element={
            <Layout>
              <RideDetailsPage />
            </Layout>
          }
        />
        <Route
          path="/rides/manage/:id"
          element={
            <Layout>
              <MyRidesManage />
            </Layout>
          }
        />
        <Route
          path="/rides/track/:id"
          element={
            <Layout>
              <TrackRide />
            </Layout>
          }
        />

        {/* Bookings */}
        <Route
          path="/bookings"
          element={
            <Layout>
              <MyBookings />
            </Layout>
          }
        />
        <Route
          path="/rides/book/:id"
          element={
            <Layout>
              <RequestBookingPage />
            </Layout>
          }
        />

        {/* Vehicles */}
        <Route
          path="/vehicles"
          element={
            <Layout>
              <MyVehicles />
            </Layout>
          }
        />
        <Route
          path="/vehicles/add"
          element={
            <Layout>
              <AddVehicle />
            </Layout>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        {/* Legacy redirect compat */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/my-rides" element={<Navigate to="/rides/my-rides" replace />} />
        <Route path="/my-bookings" element={<Navigate to="/bookings" replace />} />
        <Route path="/add-vehicle" element={<Navigate to="/vehicles/add" replace />} />
        <Route path="/my-vehicles" element={<Navigate to="/vehicles" replace />} />
        <Route path="/create-ride" element={<Navigate to="/rides/create" replace />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
