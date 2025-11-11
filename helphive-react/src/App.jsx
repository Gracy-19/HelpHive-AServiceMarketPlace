import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import MainLayout from "./layouts/MainLayout";

// ✅ Customer pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import BookingDetails from "./pages/BookingDetails";
import Providers from "./pages/Providers";

// ✅ Worker pages
import WorkerLogin from "./pages/WorkerLogin";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerProfileForm from "./pages/WorkerProfileForm";

function App() {
  return (
    <Routes>
      {/* ✅ CUSTOMER PUBLIC ROUTES (Uses MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/providers" element={<Providers />} />

        {/* Redirect /provider/:id → Providers page */}
        <Route
          path="/provider/:id"
          element={<Navigate to="/providers" replace />}
        />

        {/* Booking */}
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/booking/:id/view" element={<BookingDetails />} />
      </Route>

      {/* ✅ CUSTOMER PROTECTED ROUTES */}
      <Route
        element={
          <SignedIn>
            <MainLayout />
          </SignedIn>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ✅ WORKER ROUTES (NO MAINLAYOUT, NO NAVBAR) */}
      <Route path="/worker-login" element={<WorkerLogin />} />

      <Route
        path="/worker-dashboard"
        element={
          <SignedIn>
            <WorkerDashboard />
          </SignedIn>
        }
      />

      {/* ✅ Worker Profile Setup (Create / Update) */}
      <Route
        path="/worker-profile"
        element={
          <SignedIn>
            <WorkerProfileForm />
          </SignedIn>
        }
      />

      {/* 🚫 REDIRECT SIGNED OUT USERS */}
      <Route
        path="*"
        element={
          <SignedOut>
            <Navigate to="/" replace />
          </SignedOut>
        }
      />
    </Routes>
  );
}

export default App;
