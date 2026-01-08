import "./Desktop_css/DesktopNavbar.css";

const DesktopNavbar = () => {
  return (
    <nav className="desktop-navbar">
      <div className="nav-left">
        <span className="logo">Signpost</span>
      </div>

      <div className="nav-center">
        <a href="/dashboard">Dashboard</a>
        <a href="#">Directory</a>
        <a href="#">Products</a>
        <a href="#">Contact</a>
      </div>

      <div className="nav-right">
        <button className="nav-btn">Login</button>
      </div>
    </nav>
  );
};

export default DesktopNavbar;
