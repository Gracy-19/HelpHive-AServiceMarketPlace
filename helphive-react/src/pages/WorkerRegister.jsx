import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Calendar, MapPin, Phone, User, FileText } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const WorkerDashboard = () => {
  const { user } = useUser();
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load worker details + their bookings
  useEffect(() => {
    const loadWorkerData = async () => {
      try {
        if (!user) return;

        // ✅ STEP 1 — find worker by Clerk ID
        const workerRes = await fetch(`${API}/api/workers/clerk/${user.id}`);
        const workerData = await workerRes.json();

        if (!workerData.success || !workerData.worker) {
          setLoading(false);
          return;
        }

        setWorker(workerData.worker);

        // ✅ STEP 2 — fetch bookings assigned to this worker
        const bookingRes = await fetch(
          `${API}/api/bookings/worker/${workerData.worker._id}`
        );
        const bookingData = await bookingRes.json();

        if (bookingData.success) {
          setBookings(bookingData.bookings);
        }
      } catch (err) {
        console.error("❌ Worker dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkerData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        You are not registered as a worker yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-brand-900 mb-10">
        Worker Dashboard
      </h1>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Bookings Assigned to You
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Notes</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b._id}
                  className="border-b last:border-none hover:bg-brand-300/10"
                >
                  {/* ✅ Customer Name */}
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-900" />
                    {b.customerName || "Customer"}
                  </td>

                  {/* ✅ Date + Time */}
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {b.date} — {b.time}
                  </td>

                  {/* ✅ Address */}
                  <td className="px-6 py-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {b.address}
                  </td>

                  {/* ✅ Phone */}
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {b.phone}
                  </td>

                  {/* ✅ Notes */}
                  <td className="px-6 py-4 flex items-center gap-2 max-w-xs truncate">
                    <FileText className="w-4 h-4 text-gray-500" />
                    {b.notes || "—"}
                  </td>

                  {/* ✅ Status */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No bookings */}
          {bookings.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              No bookings assigned yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard; use .env for url thing
