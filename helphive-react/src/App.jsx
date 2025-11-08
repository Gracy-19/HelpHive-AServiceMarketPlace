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
import Providers from "./pages/Providers"; // ✅ new page that shows all workers

function App() {
  return (
    <Routes>
      {/* 🏠 Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/providers" element={<Providers />} />{" "}
        <Route
          path="/provider/:id"
          element={<Navigate to="/providers" replace />}
        />
        {/* ✅ New workers page */}
        <Route path="/booking" element={<Booking />} />{" "}
        {/* ✅ Generic booking form */}
        <Route path="/booking/:id" element={<Booking />} />{" "}
        {/* ✅ Worker-specific booking */}
        <Route path="/booking/:id/view" element={<BookingDetails />} />
      </Route>

      {/* 🔒 Protected Routes */}
      <Route
        element={
          <SignedIn>
            <MainLayout />
          </SignedIn>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/worker-register" element={<WorkerRegister />} />
      </Route>

      {/* 🚫 Redirect if signed out */}
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
