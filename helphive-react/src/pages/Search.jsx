import { useState, useEffect } from "react";
import { Search as SearchIcon, Sparkles, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

// ✅ Load backend URL from .env
const API = import.meta.env.VITE_BACKEND_URL;

const Search = () => {
  const [workers, setWorkers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch workers from backend
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch(`${API}/api/workers`);
        const data = await res.json();
        if (data.success) setWorkers(data.workers);
      } catch (err) {
        console.error("Error fetching workers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  // ✅ Filter workers by name, city, or service
  const filteredWorkers = workers.filter(
    (w) =>
      w.fullName?.toLowerCase().includes(query.toLowerCase()) ||
      w.city?.toLowerCase().includes(query.toLowerCase()) ||
      w.service?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-brand-300/10 via-white to-brand-900/5">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center px-6 mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="text-brand-900 w-6 h-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-900 tracking-tight">
            Find Your Perfect Service
          </h2>
        </div>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Search verified professionals from HelpHive — trusted for home,
          repair, and wellness services.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-6 mb-16">
        <div className="relative shadow-lg rounded-2xl overflow-hidden border border-brand-300/40 bg-white/90 backdrop-blur-md">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-900 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by service, name, or city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 pl-12 pr-4 text-gray-800 text-base rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-300 placeholder:text-gray-400 transition"
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">Loading workers...</p>
          </div>
        ) : filteredWorkers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkers.map((worker) => (
              <div
                key={worker._id}
                className="group bg-white/90 border border-gray-100 rounded-2xl p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Worker Photo */}
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
                  {worker.photoUrl ? (
                    <img
                      src={worker.photoUrl}
                      alt={worker.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                      No Photo
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-brand-900">
                  {worker.fullName}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Service:</span> {worker.service}
                </p>

                <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                  <MapPin className="w-4 h-4 text-brand-900" />
                  {worker.city || "Unknown"}
                </p>

                <p className="text-sm text-gray-600 mb-3">
                  ₹{worker.hourlyRate}/hr
                </p>

                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="text-sm text-gray400">(new)</span>
                </div>

                <Link
                  to={`/provider/${worker._id}`}
                  className="text-brand-900 text-sm font-medium hover:underline"
                >
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium mb-3">No workers found 😕</p>
            <p className="text-sm">
              Try searching for something else, like “cleaning” or “salon”.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
