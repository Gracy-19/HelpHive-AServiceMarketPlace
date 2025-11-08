import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, FileText } from "lucide-react";

const Booking = () => {
  const { id } = useParams(); // optional param
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null); // for single worker
  const [workersList, setWorkersList] = useState([]); // for dropdown list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    providerId: "",
    providerName: "",
    service: "",
    date: "",
    time: "",
    duration: "1",
    address: "",
    phone: "",
    notes: "",
  });

  // ✅ Fetch workers (single or all)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // single worker booking
          const res = await fetch(`http://localhost:4000/api/workers/${id}`);
          const data = await res.json();
          if (!data.success || !data.worker)
            throw new Error("Worker not found");
          setWorker(data.worker);
          setFormData((prev) => ({
            ...prev,
            providerId: data.worker._id,
            providerName: data.worker.fullName,
            service: data.worker.service,
          }));
        } else {
          // all workers for dropdown
          const res = await fetch(`http://localhost:4000/api/workers`);
          const data = await res.json();
          if (!data.success) throw new Error("Failed to load providers");
          setWorkersList(data.workers);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // when selecting provider from dropdown
    if (name === "providerId") {
      const selected = workersList.find((w) => w._id === value);
      setWorker(selected || null); // ✅ update selected worker state

      setFormData((prev) => ({
        ...prev,
        providerId: value,
        providerName: selected?.fullName || "",
        service: selected?.service || "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const hourlyRate = worker?.hourlyRate || 500;
      const amount = hourlyRate * parseInt(formData.duration || 1);

      const payload = {
        providerId: formData.providerId,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        address: formData.address,
        phone: formData.phone,
        notes: formData.notes,
        amount,
      };

      const res = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Booking failed");

      setBookingConfirmed(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("Booking failed: " + err.message);
    }
  };

  // 🌀 Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="text-center py-40 text-gray-600 text-lg">
        {error}
        <br />
        <Link
          to="/search"
          className="text-brand-900 font-semibold hover:underline"
        >
          ← Go back to search
        </Link>
      </div>
    );
  }

  // ✅ Booking Confirmed
  if (bookingConfirmed) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-5xl">✅</span>
        </div>
        <h2 className="text-4xl font-extrabold text-brand-900 mb-3">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mb-3 text-lg">
          Your service with <b>{formData.providerName}</b> has been successfully
          booked.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  // ✅ Booking Form
  return (
    <section className="min-h-screen bg-gradient-to-b from-brand-300/10 via-white to-brand-900/5 py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-lg p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-2">
          {id ? `Book ${formData.providerName}` : "Book a Service"}
        </h1>
        <p className="text-gray-600 mb-8">
          Fill out the form below to confirm your booking.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Choose Provider */}
          {!id && (
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Choose Provider
              </label>
              <select
                name="providerId"
                value={formData.providerId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-brand-300/40 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none transition"
              >
                <option value="">Select provider</option>
                {workersList.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.fullName} — {w.service} ({w.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Provider info */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Service Provider
            </label>
            <input
              type="text"
              value={formData.providerName}
              disabled
              className="w-full px-4 py-3 border border-brand-300/40 rounded-xl bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Service Type
            </label>
            <input
              type="text"
              value={formData.service}
              disabled
              className="w-full px-4 py-3 border border-brand-300/40 rounded-xl bg-gray-100 text-gray-700"
            />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900 w-5 h-5" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-brand-300/40 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Preferred Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900 w-5 h-5" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-brand-300/40 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Service Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900 w-5 h-5" />
              <input
                type="text"
                name="address"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-brand-300/40 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-brand-300/40 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Special Instructions
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-brand-900 w-5 h-5" />
              <textarea
                name="notes"
                placeholder="Any special instructions..."
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full pl-10 pr-4 py-3 border border-brand-300/40 rounded-xl focus:ring-2 focus:ring-brand-300 outline-none resize-none transition"
              />
            </div>
          </div>

          {/* ✅ Dynamic Price */}
          <div className="bg-brand-300/10 border border-brand-300/30 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Base Price (per hour):</span>
              <span className="font-semibold">
                ₹{worker?.hourlyRate || 500}
              </span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Duration:</span>
              <span className="font-semibold">{formData.duration} hour(s)</span>
            </div>
            <div className="border-t border-brand-300/30 mt-2 pt-2 flex justify-between">
              <span className="text-lg font-bold text-brand-900">
                Estimated Total:
              </span>
              <span className="text-lg font-bold text-brand-900">
                ₹
                {(worker?.hourlyRate || 500) * parseInt(formData.duration || 1)}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-4">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 accent-brand-900"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-brand-900 hover:underline">
                terms and conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-brand-900 hover:underline">
                cancellation policy
              </a>
              .
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-brand-900 text-white py-3.5 rounded-full hover:bg-brand-300 hover:text-brand-900 transition-all duration-300 font-semibold text-lg shadow-md"
          >
            Confirm Booking
          </button>

          <p className="text-center text-sm text-gray-600">
            <Link
              to="/search"
              className="text-brand-900 hover:underline font-medium"
            >
              ← Browse more providers
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Booking;
