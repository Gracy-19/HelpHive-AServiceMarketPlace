import React from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import {
  ShieldCheck,
  CalendarDays,
  MessageSquarePlus,
  Smile,
  Star,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { openSignUp } = useClerk();
  const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (!isSignedIn) {
      openSignUp({ redirectUrl: "/dashboard" });
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-300/30 via-white to-brand-900/5 text-gray-800">
      {/* Navbar */}
      <Navbar hideExtraLinks />

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-20 py-32 md:py-40 transition-all duration-500">
        {/* Left Content */}
        <div
          className="flex-1 text-center md:text-left animate-fade-in-up"
          aria-label="Welcome message"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-brand-900">
            Welcome to <span className="text-brand-300">HelpHive</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
            Find trusted professionals for all your household needs — from
            cleaning and repairs to beauty and wellness.
            <br />
            Your hive of reliable services.
          </p>

          <button
            onClick={handleGetStarted}
            className="mt-8 px-8 py-3 bg-brand-900 text-white rounded-full shadow-md hover:bg-brand-300 hover:text-brand-900 transition-all duration-300"
          >
            {isSignedIn ? "Go to Dashboard" : "Get Started"}
          </button>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 flex justify-center md:justify-end animate-fade-in">
          <div className="relative w-72 h-72 md:w-96 md:h-96 bg-brand-900/10 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-500">
            <Smile size={120} className="text-brand-900 opacity-70" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-300/40 to-transparent blur-3xl"></div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-brand-900 text-white py-16 px-6 md:px-20 rounded-t-3xl shadow-inner">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-brand-300">HelpHive?</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<ShieldCheck size={40} />}
            title="Verified Professionals"
            description="All our service providers are background-checked and verified for safety."
          />
          <FeatureCard
            icon={<CalendarDays size={40} />}
            title="Easy Booking"
            description="Schedule services at your convenience with just a few clicks."
          />
          <FeatureCard
            icon={<MessageSquarePlus size={40} />}
            title="Instant Support"
            description="Need help? Our team is available 24/7 to assist you instantly."
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 md:px-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-900 mb-10">
          Loved by Customers
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Testimonial
            name="Riya Sharma"
            text="HelpHive made finding a cleaner so easy. Professional and on time!"
            rating={5}
          />
          <Testimonial
            name="Amit Verma"
            text="I booked an electrician and he was at my doorstep in 30 minutes!"
            rating={4}
          />
          <Testimonial
            name="Sneha Patel"
            text="I use HelpHive every week for salon services at home. Love it!"
            rating={5}
          />
        </div>
      </section>

      {/* Worker Registration Section */}
      <section className="bg-gradient-to-r from-brand-300/30 to-brand-900/10 py-20 px-6 md:px-20 text-center rounded-t-3xl">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md border border-brand-300/30 rounded-3xl shadow-lg p-10 hover:shadow-2xl transition-all duration-500">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-brand-900/10 rounded-full">
              <Briefcase className="text-brand-900 w-10 h-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-brand-900 mb-3">
            Want to Work with HelpHive?
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Join our growing network of trusted professionals and start earning
            by offering your skills and services through HelpHive.
          </p>
          <Link
            to="/worker-login"
            className="bg-brand-900 text-white px-5 py-3 rounded-full shadow-md hover:bg-brand-300 hover:text-brand-900"
          >
            Register as Worker
          </Link>
        </div>
      </section>
    </div>
  );
};

// FeatureCard Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/10 hover:bg-white/20 transition rounded-2xl p-6 text-center shadow-lg hover:-translate-y-1 duration-300">
    <div className="flex justify-center mb-4 text-brand-300">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-200">{description}</p>
  </div>
);

// Testimonial Component
const Testimonial = ({ name, text, rating }) => (
  <div className="bg-brand-300/20 border border-brand-300/40 rounded-2xl p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
    <p className="italic mb-4">“{text}”</p>
    <div className="flex justify-center gap-1 mb-2">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
      ))}
    </div>
    <h4 className="font-semibold text-brand-900">{name}</h4>
  </div>
);

export default Home;
