import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

// ✅ Load Backend URL from .env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/bookings/${id}`);
        const data = await res.json();
        if (data.success) setBooking(data.booking);
      } catch (err) {
        console.error("❌ Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
        alert(`Booking marked as ${status}`);
      }
    } catch (err) {
      console.error("❌ Error updating booking:", err);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Thank you for your feedback!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Error submitting rating:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading booking details...
      </div>
    );

  if (!booking)
    return (
      <div className="text-center py-40 text-gray-600 text-lg">
        Booking not found.
        <br />
        <Link
          to="/dashboard"
          className="text-brand-900 font-semibold hover:underline"
        >
          ← Go back
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-brand-900 mb-6">
        Booking Details
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {booking.service} —{" "}
          {booking.providerName || booking.providerId?.fullName}
        </h2>

        <p className="flex items-center gap-2 text-gray-600 mb-2">
          <Calendar size={16} /> {booking.date} at {booking.time}
        </p>

        <p className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin size={16} /> {booking.address}
        </p>

        <p className="text-gray-600 mb-2">Amount: ₹{booking.amount}</p>
        <p className="text-gray-600 mb-2">Status: {booking.status}</p>
      </div>

      {/* Status Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleStatusChange("Completed")}
          className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700"
        >
          Mark as Completed
        </button>

        <button
          onClick={() => handleStatusChange("Cancelled")}
          className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700"
        >
          Cancel Booking
        </button>
      </div>

      {/* Rating Section */}
      {booking.status === "Completed" && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Rate your service
          </h3>

          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                onClick={() => setRating(star)}
                className={`cursor-pointer ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            placeholder="Write your feedback..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-brand-300 outline-none mb-4"
          />

          <button
            onClick={handleRatingSubmit}
            className="bg-brand-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-700 transition"
          >
            Submit Rating
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
