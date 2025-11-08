import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Hexagon, Sparkles } from "lucide-react";

const Navbar = ({ hideExtraLinks = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openSignUp, signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ✅ only "Search" and "Provider Detail" remain
  const navItems = [
    { name: "Search", path: "/search" },
    { name: "Booking", path: "/booking" },
    { name: "Providers", path: "/providers", icon: "" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-20 w-full bg-white/80 backdrop-blur-md shadow-md border-b border-brand-300/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* 🔷 Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center rounded-full bg-brand-900/10 p-2 group-hover:rotate-6 transition-transform">
            <Sparkles className="h-6 w-6 text-brand-900" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-brand-900 flex items-center gap-1">
            Help
            <Hexagon className="h-5 w-5 text-brand-700" />
            Hive
          </span>
        </Link>

        {/* 💻 Desktop Menu */}
        <div className="hidden lg:flex items-center gap-5">
          {!hideExtraLinks && (
            <div className="flex items-center gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
                    pathname === item.path
                      ? "bg-brand-300 text-brand-900 border-brand-300 shadow-md"
                      : "text-brand-900 bg-brand-300/20 border-transparent hover:border-brand-300 hover:bg-brand-300/40 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* 🔐 Right-side Actions */}
          {!isSignedIn ? (
            <button
              onClick={() => openSignUp({ redirectUrl: "/dashboard" })}
              className="rounded-full bg-brand-900 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="rounded-full bg-brand-300 px-5 py-2 text-sm font-semibold text-brand-900 shadow-md transition hover:bg-brand-900 hover:text-white hover:-translate-y-0.5"
              >
                Dashboard
              </Link>

              {/* 👤 Profile Avatar */}
              <button
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full border-2 border-brand-300 overflow-hidden flex items-center justify-center bg-gray-100 hover:ring-2 hover:ring-brand-300 transition-all"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </button>

              <button
                onClick={() => signOut()}
                className="rounded-full border border-brand-300 px-5 py-2 text-sm font-semibold text-brand-900 hover:bg-red-500 hover:text-white transition hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* 📱 Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-300 text-brand-900 transition hover:bg-brand-100 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <div className="rounded-2xl border border-brand-300/40 bg-white/90 p-5 shadow-lg backdrop-blur-xl flex flex-col gap-3">
              {!hideExtraLinks && (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-center py-2 rounded-full font-medium transition-all ${
                        pathname === item.path
                          ? "bg-brand-300 text-brand-900 shadow-md"
                          : "text-brand-900 bg-brand-300/20 hover:bg-brand-300/40 hover:shadow"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}

              {!isSignedIn ? (
                <button
                  onClick={() => {
                    openSignUp({ redirectUrl: "/dashboard" });
                    setIsOpen(false);
                  }}
                  className="w-full rounded-full bg-brand-900 px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 mt-2"
                >
                  Get Started
                </button>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-full bg-brand-300 px-5 py-3 text-center text-sm font-semibold text-brand-900 shadow-md transition hover:bg-brand-900 hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 rounded-full border border-brand-300 py-2 text-sm font-semibold text-brand-900 hover:bg-gray-100 transition"
                  >
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full mt-2 rounded-full border border-brand-300 px-5 py-3 text-center text-sm font-semibold text-brand-900 hover:bg-red-500 hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
