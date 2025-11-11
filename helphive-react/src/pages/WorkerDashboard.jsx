import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import WorkerProfileForm from "./WorkerProfileForm";
import WorkerDashboardUI from "./WorkerDashboardUI";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const WorkerDashboard = () => {
  const { user, isLoaded } = useUser();
  const [worker, setWorker] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Worker + Bookings
  const loadDashboard = async () => {
    if (!user) return;

    try {
      // ✅ 1) Fetch Worker by clerkId
      const res = await fetch(`${API}/api/workers/clerk/${user.id}`, {
        headers: { Accept: "application/json" },
      });

      const text = await res.text();
      if (text.startsWith("<")) {
        throw new Error("Server returned HTML instead of JSON");
      }

      const data = JSON.parse(text);

      if (data.success && data.worker) {
        setWorker(data.worker);

        // ✅ 2) Fetch today's bookings
        const bRes = await fetch(
          `${API}/api/workers/bookings/today/${data.worker._id}`,
          { headers: { Accept: "application/json" } }
        );

        const bText = await bRes.text();
        if (bText.startsWith("<")) {
          throw new Error("Bookings API returned HTML");
        }

        const bData = JSON.parse(bText);

        if (bData.success) {
          setTodayBookings(bData.bookings);
        }
      }
    } catch (err) {
      console.error("❌ Worker Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load when Clerk is ready
  useEffect(() => {
    if (isLoaded && user) {
      loadDashboard();
    }
  }, [isLoaded, user]);

  // ✅ Loading Screen
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  // ✅ Worker does NOT exist → Ask to create profile
  if (!worker)
    return <WorkerProfileForm mode="create" onSaved={loadDashboard} />;

  // ✅ Worker exists → Show Dashboard UI
  return (
    <WorkerDashboardUI
      worker={worker}
      bookings={todayBookings}
      onProfileUpdated={loadDashboard}
    />
  );
};

export default WorkerDashboard;
