import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Calendar, MapPin, Phone, User, FileText, Edit3 } from "lucide-react";

// ✅ Load backend URL from .env
const API = import.meta.env.VITE_BACKEND_URL;

const WorkerDashboard = () => {
  const { user } = useUser();
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    bio: "",
    hourlyRate: "",
  });

  // ✅ Load worker details + bookings
  useEffect(() => {
    const loadWorkerData = async () => {
      try {
        if (!user) return;

        // ✅ STEP 1 - Find worker by Clerk ID
        const workerRes = await fetch(`${API}/api/workers/clerk/${user.id}`);
        const workerData = await workerRes.json();

        if (!workerData.success || !workerData.worker) {
          setLoading(false);
          return;
        }

        setWorker(workerData.worker);

        // ✅ Pre-fill form data
        setFormData({
          fullName: workerData.worker.fullName || "",
          phone: workerData.worker.phone || "",
          city: workerData.worker.city || "",
          address: workerData.worker.address || "",
          bio: workerData.worker.bio || "",
          hourlyRate: workerData.worker.hourlyRate || "",
        });

        // ✅ STEP 2 - Fetch worker bookings
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

  // ✅ Handle edit form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ Save updated worker info
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/workers/${worker._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Profile updated!");
        setWorker(data.worker);
        setEditing(false);
      } else {
        alert("❌ Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  if (!worker)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        You are not registered as a worker yet.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-brand-900">
          Worker Dashboard
        </h1>

        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-brand-900 text-white rounded-full flex items-center gap-2 hover:bg-brand-300 hover:text-brand-900 transition"
        >
          <Edit3 className="w-4 h-4" />
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* ✅ WORKER PROFILE FORM */}
      <form
        onSubmit={handleSave}
        className="bg-white/90 p-8 rounded-2xl shadow-md border border-gray-200 mb-12"
      >
        <h2 className="text-2xl font-semibold mb-6 text-brand-900">
          Your Worker Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <Field
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!editing}
          />

          {/* Phone */}
          <Field
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editing}
          />

          {/* City */}
          <Field
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!editing}
          />

          {/* Hourly Rate */}
          <Field
            label="Hourly Rate (₹)"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="font-semibold text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!editing}
            rows="2"
            className="w-full mt-1 border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="font-semibold text-gray-700">Professional Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!editing}
            rows="3"
            className="w-full mt-1 border px-3 py-2 rounded-lg"
          />
        </div>

        {editing && (
          <button
            type="submit"
            className="mt-6 w-full bg-brand-900 text-white py-3 rounded-full font-semibold hover:bg-brand-300 hover:text-brand-900 transition"
          >
            Save Changes
          </button>
        )}
      </form>

      {/* ✅ BOOKINGS TABLE */}
      <div className="bg-white/90 rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-semibold">Bookings Assigned to You</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <Th label="Customer" />
              <Th label="Date" />
              <Th label="Address" />
              <Th label="Phone" />
              <Th label="Notes" />
              <Th label="Status" />
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-50">
                <Td icon={<User />} text={b.customerName || "Customer"} />
                <Td icon={<Calendar />} text={`${b.date} — ${b.time}`} />
                <Td icon={<MapPin />} text={b.address} />
                <Td icon={<Phone />} text={b.phone} />
                <Td icon={<FileText />} text={b.notes || "—"} />

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-gray-500 italic"
                >
                  No bookings assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerDashboard;

/* ✅ REUSABLE COMPONENTS */

const Field = ({ label, name, value, onChange, disabled }) => (
  <div>
    <label className="font-semibold text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      disabled={disabled}
      value={value}
      onChange={onChange}
      className="w-full mt-1 border px-3 py-2 rounded-lg disabled:bg-gray-100"
    />
  </div>
);

const Th = ({ label }) => (
  <th className="px-6 py-3 text-left font-semibold text-xs">{label}</th>
);

const Td = ({ icon, text }) => (
  <td className="px-6 py-4 flex items-center gap-2">
    {icon}
    {text}
  </td>
);
