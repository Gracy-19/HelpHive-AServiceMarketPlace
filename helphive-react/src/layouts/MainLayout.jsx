import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="bg-brand-100 text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28">
        <Outlet /> {/* Child pages will render here */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
