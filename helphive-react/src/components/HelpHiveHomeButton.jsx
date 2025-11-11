import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const HelpHiveHomeButton = () => (
  <Link
    to="/"
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-900 text-white font-semibold shadow hover:bg-brand-300 hover:text-brand-900 transition"
  >
    <Home className="w-5 h-5" />
    HelpHive Home
  </Link>
);

export default HelpHiveHomeButton;
