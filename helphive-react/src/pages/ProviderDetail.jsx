import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, User } from "lucide-react";

// ✅ Load backend URL from .env
const API = import.meta.env.VITE_BACKEND_URL;

const ProviderDetail = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch worker data from backend
  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await fetch(`${API}/api/workers/${id}`);
        const data = await res.json();
        if (data.success) setWorker(data.worker);
      } catch (err) {
        console.error("Error fetching worker:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-40 text-gray-500 text-lg">
        Loading worker details...
      </div>
    );

  if (!worker)
    return (
      <div className="text-center py-40 text-gray-600 text-lg">
        Worker not found 😕
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-brand-300/10 via-white to-brand-900/5 pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center transition-all duration-300">
        
        {/* Worker Photo */}
        <div className="flex-shrink-0">
          <img
            src={worker.photoUrl || "/default-user.png"}
            alt={worker.fullName}
            className="w-56 h-56 md:w-64 md:h-64 rounded-2xl object-cover shadow-md hover:shadow-lg transition-all duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Worker Details */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900">
              {worker.fullName}
            </h2>

            <div className="flex items-center justify-center md:justify-end gap-1 mt-2 md:mt-0">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-gray-600 ml-1 text-sm">(new)</span>
            </div>
          </div>

          <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 text-sm mb-3">
            <MapPin className="w-4 h-4 text-brand-300" />
            {worker.city || "Unknown"}
          </p>

          <div className="inline-flex items-center gap-2 bg-brand-300/20 text-brand-900 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <User className="w-4 h-4" />
            {worker.service}
          </div>

          <p className="text-gray-700 leading-relaxed text-base mb-6">
            {worker.bio || "No description provided."}
          </p>

          <p className="text-lg font-semibold text-brand-900 mb-6">
            Hourly Rate: ₹{worker.hourlyRate || "N/A"}
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {/* ✅ Dynamic link with worker._id */}
            <Link
              to={`/booking/${worker._id}`}
              className="bg-brand-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-300 hover:text-brand-900 transition-all duration-300 shadow-md"
            >
              Book Now
            </Link>

            <Link
              to="/search"
              className="border-2 border-brand-900 text-brand-900 px-8 py-3 rounded-full font-semibold hover:bg-brand-300/20 transition-all duration-300"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>

      {/* Extra Info Section */}
      <div className="max-w-5xl mx-auto mt-14 grid md:grid-cols-3 gap-8">
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow hover:-translate-y-1 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-brand-900 mb-2">
            Verified & Trusted
          </h3>
          <p className="text-gray-600 text-sm">
            All professionals on HelpHive are background-checked and verified.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow hover:-translate-y-1 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-brand-900 mb-2">
            Quick Booking
          </h3>
          <p className="text-gray-600 text-sm">
            Secure your booking instantly and manage everything from your
            dashboard.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow hover:-translate-y-1 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-brand-900 mb-2">
            Customer Support
          </h3>
          <p className="text-gray-600 text-sm">
            Need help? Our support team is available 24/7 to assist you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProviderDetail;
