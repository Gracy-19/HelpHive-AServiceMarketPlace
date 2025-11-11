import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Calendar, MapPin, User } from "lucide-react";

// ✅ Load backend URL from .env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Dashboard = () => {
  const { user, isLoaded } = useUser();

  const fullName =
    (isLoaded && (user?.fullName || user?.firstName || "User")) || "User";

  const [bookings, setBookings] = useState([]);

  // ✅ Fetch only AFTER Clerk is fully loaded + user exists
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/bookings?clerkId=${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setBookings(data.bookings);
        } else {
          console.error("Booking API error:", data.message);
        }
      } catch (err) {
        console.error("❌ Failed to load bookings:", err);
      }
    };

    fetchBookings();
  }, [isLoaded, user]);

  // ✅ Update booking status
  const handleMarkCompleted = async (bookingId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });

      const data = await res.json();

      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "Completed" } : b
          )
        );
      } else {
        alert("Failed to mark as completed!");
      }
    } catch (err) {
      console.error("❌ Status update error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      {/* 🌟 Welcome Section */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-300 text-white rounded-3xl p-10 shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute right-10 top-10 text-white/20 text-[6rem] font-extrabold select-none">
          👋
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          Welcome back, {fullName}!
        </h1>
        <p className="text-white/80 text-lg max-w-lg">
          Here’s what’s happening with your services and bookings.
        </p>
      </div>

      {/* 🗓️ Recent Bookings */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Recent Bookings
          </h2>
          <Link
            to="/search"
            className="bg-brand-300/20 text-brand-900 px-4 py-2 rounded-full font-medium hover:bg-brand-300/30 transition"
          >
            + New Booking
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Provider</th>
                <th className="px-6 py-3 text-left font-semibold">Service</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Location</th>
                <th className="px-6 py-3 text-left font-semibold">Amount</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b last:border-none hover:bg-brand-300/10 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <User size={16} className="text-brand-900" />
                    {booking.providerId?.fullName || "N/A"}
                  </td>

                  <td className="px-6 py-4">{booking.service}</td>

                  <td className="px-6 py-4 flex items-center gap-2">
                    <Calendar size={15} className="text-gray-500" />
                    {booking.date} • {booking.time}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2">
                    <MapPin size={15} className="text-gray-500" />
                    {booking.providerId?.city || "—"}
                  </td>

                  <td className="px-6 py-4 font-semibold text-brand-900">
                    ₹{booking.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* ✅ Action Button */}
                  <td className="px-6 py-4">
                    {booking.status === "Completed" ? (
                      <span className="text-green-600 font-semibold">
                        Done ✅
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkCompleted(booking._id)}
                        className="text-brand-900 font-semibold hover:underline"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <p className="text-center py-10 text-gray-500">
              No bookings yet. Book your first service!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
