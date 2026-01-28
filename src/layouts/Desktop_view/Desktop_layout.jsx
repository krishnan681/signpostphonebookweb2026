// layouts/Desktop_view/Desktop_layout.jsx
import "./Desktop_css/Desktop_layout.css";
import DesktopNavbar from "./DesktopNavbar";

const DesktopLayout = ({ children }) => {
  return (
    <div className="desktop-layout">
      <DesktopNavbar />
      <main className="desktop-content">
        {children}
      </main>
    </div>
  );
};

export default DesktopLayout;
