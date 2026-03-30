import DesktopNavbar from "./DesktopNavbar";
import "./Desktop_css/Desktop_layout.css";

const DesktopLayout = ({ children }) => {
  return (
    <>
      <DesktopNavbar />
      <main className="desktop-main">{children}</main>
    </>
  );
};

export default DesktopLayout;
