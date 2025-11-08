import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, User } from "lucide-react";

const Providers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/workers");
        const data = await res.json();
        if (data.success) {
          setWorkers(data.workers);
        }
      } catch (err) {
        console.error("❌ Failed to load workers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading providers...
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-brand-300/10 via-white to-brand-900/5 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-900 mb-3">
            Our Trusted Service Providers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find verified professionals near you — from home help to beauty and
            wellness.
          </p>
        </div>

        {/* Workers Grid */}
        {workers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {workers.map((worker) => (
              <div
                key={worker._id}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="w-full h-56 overflow-hidden rounded-2xl mb-4">
                  <img
                    src={
                      worker.photoUrl ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={worker.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-xl font-bold text-brand-900">
                    {worker.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <User className="w-4 h-4 text-brand-300" />
                    {worker.service}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-brand-300" />
                    {worker.city || "Not specified"}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <Star
                      className={`w-5 h-5 ${
                        worker.averageRating > 0
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                    <span className="text-gray-700 text-sm">
                      {worker.averageRating
                        ? `${worker.averageRating} / 5`
                        : "No ratings yet"}
                    </span>
                  </div>

                  <p className="text-brand-900 font-semibold mt-2">
                    ₹{worker.hourlyRate || 500}/hour
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex justify-between items-center">
                  <Link
                    to={`/booking/${worker._id}`}
                    className="bg-brand-900 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-300 hover:text-brand-900 transition-all duration-300 shadow-md"
                  >
                    Book Now
                  </Link>
                  {worker.documentsUrl && (
                    <a
                      href={worker.documentsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-700 hover:underline"
                    >
                      View Docs
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-20">
            No providers found yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Providers;
