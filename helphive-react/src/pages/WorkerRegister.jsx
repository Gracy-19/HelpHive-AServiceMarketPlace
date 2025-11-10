import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Phone,
  ClipboardList,
  FileText,
  Upload,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

// ✅ Load backend URL from .env
const API = import.meta.env.VITE_BACKEND_URL;

const WorkerRegister = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    experience: "",
    address: "",
    city: "",
    hourlyRate: "",
    certifications: "",
    bio: "",
    photo: null,
    documents: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle field & file change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) fd.append(key, formData[key]);
      });

      if (user?.id) fd.append("clerkId", user.id);

      const res = await fetch(`${API}/api/workers`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Submission failed");
      }

      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-300/20 via-white to-brand-900/10 flex flex-col">
        <Navbar hideExtraLinks />
        <div className="flex-grow flex flex-col justify-center items-center px-6 py-20 text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mb-6">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-brand-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-600 max-w-md">
            Thank you for registering as a service provider. Our team will
            review your application and contact you within 24–48 hours.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-300/20 via-white to-brand-900/10 text-gray-800">
      <Navbar hideExtraLinks />

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-900/10 rounded-full">
              <Briefcase className="text-brand-900 w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-brand-900 mb-3">
            Join HelpHive as a Service Provider
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Register to start offering your services and connect with thousands
            of clients through HelpHive.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 p-10 space-y-12 transition-all"
        >
          {/* PERSONAL INFORMATION */}
          <SectionHeader icon={<User />} title="Personal Information" />

          <div className="grid md:grid-cols-2 gap-6">
            <TextField
              label="Full Name"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              icon={<Mail className="text-gray-400 w-4 h-4" />}
            />

            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={handleChange}
              required
              icon={<Phone className="text-gray-400 w-4 h-4" />}
            />

            <TextField
              label="City"
              name="city"
              placeholder="Your city"
              value={formData.city}
              onChange={handleChange}
              required
              icon={<MapPin className="text-gray-400 w-4 h-4" />}
            />
          </div>

          <TextArea
            label="Address"
            name="address"
            placeholder="Full address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          {/* PROFESSIONAL INFORMATION */}
          <SectionHeader icon={<ClipboardList />} title="Professional Information" />

          <div className="grid md:grid-cols-2 gap-6">
            <SelectField
              label="Service Type"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              options={[
                "Babysitting",
                "Cleaning / Maid",
                "Cooking",
                "Laundry",
                "Tutoring",
                "Pet Care",
              ]}
            />

            <TextField
              label="Hourly Rate (₹)"
              name="hourlyRate"
              type="number"
              placeholder="e.g., 500"
              value={formData.hourlyRate}
              onChange={handleChange}
              required
            />

            <SelectField
              label="Experience (Years)"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              options={[
                "Less than 1 year",
                "1–3 years",
                "3–5 years",
                "5+ years",
              ]}
            />

            <TextField
              label="Certifications (optional)"
              name="certifications"
              placeholder="e.g., First Aid, CPR"
              value={formData.certifications}
              onChange={handleChange}
            />
          </div>

          <TextArea
            label="Professional Bio"
            name="bio"
            placeholder="Tell clients about your skills and experience..."
            value={formData.bio}
            onChange={handleChange}
            required
          />

          {/* DOCUMENTS */}
          <SectionHeader icon={<FileText />} title="Documents & Media" />

          <div className="grid md:grid-cols-2 gap-6">
            <FileUpload
              label="Profile Photo"
              name="photo"
              accept="image/*"
              file={formData.photo}
              onChange={handleChange}
              icon={<Upload className="w-5 h-5 text-brand-900" />}
            />

            <FileUpload
              label="Proof Documents"
              name="documents"
              accept=".pdf,.doc,.docx"
              file={formData.documents}
              onChange={handleChange}
              icon={<Upload className="w-5 h-5 text-brand-900" />}
            />
          </div>

          {/* AGREEMENTS */}
          <div className="bg-brand-300/10 border border-brand-300/30 rounded-2xl p-6 space-y-4">
            <Checkbox
              id="terms"
              label={
                <>
                  I agree to HelpHive’s{" "}
                  <a href="#" className="text-brand-900 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-brand-900 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </>
              }
            />

            <Checkbox
              id="verification"
              label="I confirm that all provided information is accurate and authentic."
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-brand-900 text-white py-3 rounded-full font-semibold shadow-md transition-all ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-brand-300 hover:text-brand-900"
              }`}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <Link
              to="/"
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-full font-semibold text-center hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 pt-2">
            Applications are verified within 24–48 hours. You’ll be notified once approved.
          </p>
        </form>
      </div>
    </div>
  );
};

export default WorkerRegister;

/* ✅ Reusable Components */

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-brand-900/10 rounded-lg text-brand-900">{icon}</div>
    <h2 className="text-2xl font-bold text-brand-900">{title}</h2>
  </div>
);

const TextField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  icon,
}) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-3">{icon}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ring-brand-300 outline-none ${
          icon ? "pl-10" : ""
        }`}
      />
    </div>
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows="3"
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-brand-300 outline-none resize-none"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-brand-300 outline-none"
    >
      <option value="">Select option</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label, name, accept, file, onChange, icon }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700">{label}</label>

    <div className="border-2 border-dashed border-brand-300 rounded-lg p-6 text-center hover:bg-brand-300/10 transition cursor-pointer">
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
        required
        className="hidden"
        id={`${name}-input`}
      />

      <label
        htmlFor={`${name}-input`}
        className="cursor-pointer flex flex-col items-center gap-2"
      >
        {icon}
        <p className="font-medium text-gray-700">Click to upload</p>
        <p className="text-sm text-gray-500">{accept}</p>
      </label>
    </div>

    {file && <p className="text-sm text-green-600 mt-2">✓ {file.name}</p>}
  </div>
);

const Checkbox = ({ id, label }) => (
  <div className="flex items-start gap-3">
    <input type="checkbox" id={id} required className="mt-1" />
    <label htmlFor={id} className="text-gray-700">
      {label}
    </label>
  </div>
);
