// src/layouts/Mobile_view/MobileNavbar.jsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Tag,
  Search,
  Megaphone,
  Settings,
} from "lucide-react";
import "./Mobile_css/MobileNavbar.css";

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/offers", icon: Tag, label: "Offers" },     
    { path: "/search", icon: Search, label: "Search" },
    { path: "/promotion", icon: Megaphone, label: "Promotion" },
    { path: "/settingspage", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`nav-item ${isActive(item.path) ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <item.icon size={24} strokeWidth={2} />
          <span className="label">{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default MobileNavbar;