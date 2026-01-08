 
import "./Mobile_css/Mobile_layout.css";
import MobileNavbar from "./MobileNavbar";

const MobileLayout = ({ children }) => {
  return (
    <div className="mobile-layout">
      <main className="mobile-content">{children}</main>
      <MobileNavbar />
      
    </div>
  );
};

export default MobileLayout;