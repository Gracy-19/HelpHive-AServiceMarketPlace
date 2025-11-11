import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  User,
  Mail,
  MapPin,
  Phone,
  ClipboardList,
  Upload,
  FileText,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const WorkerProfileForm = ({
  worker = null,
  mode = "create",
  onClose,
  onSaved,
}) => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    service: "",
    hourlyRate: "",
    experience: "",
    certifications: "",
    bio: "",
    photo: null,
    documents: null,
  });

  useEffect(() => {
    if (!user) return;

    setFormData({
      fullName: worker?.fullName || user.fullName || "",
      email:
        worker?.email ||
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses[0]?.emailAddress ||
        "",
      phone: worker?.phone || user.primaryPhoneNumber?.phoneNumber || "",
      city: worker?.city || "",
      address: worker?.address || "",
      service: worker?.service || "",
      hourlyRate: worker?.hourlyRate || "",
      experience: worker?.experience || "",
      certifications: worker?.certifications || "",
      bio: worker?.bio || "",
      photo: null,
      documents: null,
    });
  }, [user, worker]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Submit form (MULTIPART FORMDATA)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) fd.append(key, formData[key]);
    });

    fd.append("clerkId", user.id);

    const url =
      mode === "edit"
        ? `${API}/api/workers/clerk/${user.id}`
        : `${API}/api/workers`;

    try {
      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        body: fd,
      });

      const data = await res.json();

      if (!data.success) return alert(data.message);

      alert("✅ Profile saved successfully");

      if (onSaved) onSaved(data.worker);
      if (onClose) onClose();
    } catch (error) {
      console.error("❌ Worker profile save error:", error);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white/90 p-10 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-brand-900 mb-6">
        {mode === "edit" ? "Edit Worker Profile" : "Create Worker Profile"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* PERSONAL */}
        <SectionHeader icon={<User />} title="Personal Information" />

        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <TextArea
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
        />

        {/* PROFESSIONAL */}
        <SectionHeader icon={<ClipboardList />} title="Professional Details" />

        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            name="service"
            label="Service"
            value={formData.service}
            onChange={handleChange}
          />

          <TextField
            name="hourlyRate"
            label="Hourly Rate (₹)"
            type="number"
            value={formData.hourlyRate}
            onChange={handleChange}
          />

          <TextField
            name="experience"
            label="Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <TextField
            name="certifications"
            label="Certifications"
            value={formData.certifications}
            onChange={handleChange}
          />
        </div>

        <TextArea
          name="bio"
          label="Short Bio"
          value={formData.bio}
          onChange={handleChange}
        />

        {/* FILE UPLOADS */}
        <SectionHeader icon={<FileText />} title="Documents & Media" />

        <FileUpload
          label="Profile Photo"
          name="photo"
          accept="image/*"
          file={formData.photo}
          onChange={handleChange}
        />

        <FileUpload
          label="Documents"
          name="documents"
          accept=".pdf,.doc,.docx"
          file={formData.documents}
          onChange={handleChange}
        />

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-brand-900 text-white py-3 rounded-full hover:bg-brand-300 hover:text-brand-900 mt-6"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default WorkerProfileForm;

/* ------------------ COMPONENTS ------------------- */

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-brand-900/10 rounded-lg text-brand-900">{icon}</div>
    <h2 className="text-xl font-bold text-brand-900">{title}</h2>
  </div>
);

const TextField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-700 mb-2 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-brand-300 outline-none"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 mb-2 font-medium">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-brand-300 outline-none"
    />
  </div>
);

const FileUpload = ({ label, name, accept, file, onChange }) => (
  <div>
    <label className="block text-gray-700 mb-2 font-medium">{label}</label>

    <input
      type="file"
      name={name}
      accept={accept}
      onChange={onChange}
      className="w-full"
    />

    {file && <p className="text-sm text-green-600 mt-1">{file.name}</p>}
  </div>
);
