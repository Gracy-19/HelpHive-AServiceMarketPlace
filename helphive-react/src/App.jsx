import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import WorkerRegister from "./pages/WorkerRegister";
import BookingDetails from "./pages/BookingDetails";
import Providers from "./pages/Providers";

function App() {
  return (
    <Routes>
      {/* ✅ PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/providers" element={<Providers />} />

        {/* Redirect /provider/:id to Providers page */}
        <Route
          path="/provider/:id"
          element={<Navigate to="/providers" replace />}
        />

        {/* ✅ Booking routes */}
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/booking/:id/view" element={<BookingDetails />} />

        {/* ✅ FIX: Make worker-register PUBLIC */}
        <Route path="/worker-register" element={<WorkerRegister />} />
      </Route>

      {/* ✅ PROTECTED ROUTES (Require Login) */}
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

      {/* 🚫 IF SIGNED OUT → Redirect to Home */}
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
