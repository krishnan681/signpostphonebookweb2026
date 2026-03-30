import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Desktop_css/DesktopNavbar.css";

const DesktopNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleAuthClick = async () => {
    if (user) {
      await logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="desktop-navbar">
      {/* LEFT */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <span className="logo">Signpost</span>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <NavLink to="/partner">About</NavLink>
        <NavLink to="/partner">Partner</NavLink>
        <NavLink to="/directory">Search</NavLink>
        <NavLink to="/MediaPartner">Promotions</NavLink>
        <NavLink to="/">Find Who</NavLink>
        <NavLink to="/profile/1">Contact</NavLink>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <button className="nav-btn" onClick={handleAuthClick}>
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default DesktopNavbar;
