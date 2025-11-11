import {
  Calendar,
  MapPin,
  Phone,
  Edit3,
  Home,
  User,
  FileText,
} from "lucide-react";
import { useState } from "react";
import WorkerProfileForm from "./WorkerProfileForm";
import { Link } from "react-router-dom";

const WorkerDashboardUI = ({ worker, bookings, onProfileUpdated }) => {
  const [edit, setEdit] = useState(false);

  // ✅ If the user clicks edit → show profile form
  if (edit) {
    return (
      <WorkerProfileForm
        mode="edit"
        worker={worker}
        onSaved={() => {
          setEdit(false);
          onProfileUpdated();
        }}
        onClose={() => setEdit(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-brand-900">
          Welcome, {worker.fullName}
        </h1>

        <div className="flex gap-3">
          {/* ✅ Home Button */}
          <Link
            to="/"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          {/* ✅ Edit Profile */}
          <button
            onClick={() => setEdit(true)}
            className="bg-brand-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-300 hover:text-brand-900 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ✅ BOOKINGS SECTION */}
      <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">Today's Bookings</h2>

        {/* ✅ If no bookings */}
        {bookings.length === 0 && (
          <p className="text-gray-500 text-lg">No bookings assigned today ✅</p>
        )}

        {/* ✅ If bookings exist */}
        {bookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-800 font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Notes</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    {/* ✅ Customer */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-900" />
                        <span>{b.customerName || "Customer"}</span>
                      </div>
                    </td>

                    {/* ✅ Date */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{b.date}</span>
                      </div>
                    </td>

                    {/* ✅ Time */}
                    <td className="py-4 px-4">{b.time}</td>

                    {/* ✅ Address (one line only) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 max-w-[180px] truncate">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{b.address}</span>
                      </div>
                    </td>

                    {/* ✅ Phone */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{b.phone}</span>
                      </div>
                    </td>

                    {/* ✅ Notes */}
                    <td className="py-4 px-4 max-w-[150px] truncate">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span>{b.notes || "—"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboardUI;
