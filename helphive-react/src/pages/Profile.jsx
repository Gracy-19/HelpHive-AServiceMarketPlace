import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { MapPin, Mail, Phone } from "lucide-react";

// ✅ Load backend URL from .env file
const API = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // ✅ Load user + total bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const clerkId = user.id;

        // ✅ Fetch total bookings from backend filtered by clerkId
        const res = await fetch(`${API}/api/bookings?clerkId=${clerkId}`);
        const data = await res.json();

        if (data.success) setTotalBookings(data.bookings.length);

        // ✅ Load Clerk data safely
        setFormData({
          fullName:
            user.fullName ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.username ||
            "User",

          email:
            user.primaryEmailAddress?.emailAddress ||
            user.emailAddresses?.[0]?.emailAddress ||
            "No Email Found",

          phone: user.primaryPhoneNumber?.phoneNumber || "",
        });
      } catch (err) {
        console.error("❌ Error loading profile:", err);
      }
    };

    fetchData();
  }, [user]);

  // ✅ Input handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Save phone number to backend
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const clerkId = user.id;

      const res = await fetch(`${API}/api/users/${clerkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Phone updated successfully!");
      } else {
        alert("❌ Failed to update phone");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error saving profile:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-brand-300/10 via-white to-brand-900/5 py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        
        {/* ✅ PROFILE CARD */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-brand-300 to-brand-900"></div>

          <div className="px-6 pb-8 text-center -mt-10 relative">
            <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white shadow-md">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand-900 text-white flex items-center justify-center text-3xl">
                  👤
                </div>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-brand-900">
              {formData.fullName}
            </h2>

            <p className="text-gray-600 text-sm">{formData.email}</p>

            <p className="text-gray-500 text-sm mt-1 flex justify-center items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-300" /> Unknown City
            </p>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Member Since
              </p>
              <p className="font-semibold text-brand-900">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* ✅ STATS */}
          <div className="px-6 pb-8 space-y-4">
            <div className="bg-brand-300/10 rounded-2xl py-4 text-center">
              <p className="text-3xl font-bold text-brand-900">
                {totalBookings}
              </p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>

            <div className="bg-brand-300/10 rounded-2xl py-4 text-center">
              <p className="text-3xl font-bold text-brand-900">✅</p>
              <p className="text-sm text-gray-600">Verified User</p>
            </div>
          </div>
        </div>

        {/* ✅ EDITABLE FORM */}
        <div className="md:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-brand-900">
              Your Profile
            </h1>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2.5 rounded-full font-semibold shadow-md transition ${
                isEditing
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-brand-900 text-white hover:bg-brand-300 hover:text-brand-900"
              }`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <form
            onSubmit={handleSave}
            className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-lg p-8 space-y-6"
          >
            <h3 className="text-lg font-bold text-brand-900 mb-4">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <InputField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                disabled
              />

              <InputField
                label="Email"
                name="email"
                value={formData.email}
                disabled
                icon={<Mail className="w-4 h-4 text-brand-900" />}
              />

              <InputField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<Phone className="w-4 h-4 text-brand-900" />}
              />
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-brand-900 text-white py-2.5 rounded-full font-semibold hover:bg-brand-300 hover:text-brand-900 transition-all duration-300 shadow-md"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

// ✅ Input Component
const InputField = ({ label, name, value, onChange, disabled, icon }) => (
  <div className="relative">
    <label className="block mb-2 text-sm font-semibold text-gray-700">
      {label}
    </label>

    {icon && <div className="absolute left-3 top-10">{icon}</div>}

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full ${
        icon ? "pl-10" : "pl-4"
      } pr-4 py-2.5 border rounded-xl outline-none transition ${
        disabled
          ? "bg-gray-50 border-gray-200 cursor-not-allowed"
          : "border-brand-300/40 focus:ring-2 focus:ring-brand-300"
      }`}
    />
  </div>
);

export default Profile;
