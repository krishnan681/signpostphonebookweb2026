import { Routes, Route, Navigate } from "react-router-dom";
import { useWindowSize } from "./hooks/useWindowSize";
import { useAuth } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext"; // fixed path

/* Layouts */
import MobileLayout from "./layouts/Mobile_view/Mobile_layout";
import DesktopLayout from "./layouts/Desktop_view/Desktop_layout";

/* Public pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* Protected pages */
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

/* Mobile pages */
import MobileViewHome from "./layouts/Mobile_view/Mobile_View_Home";
import SearchPage from "./layouts/Mobile_view/SearchPage";
import ModelPage from "./layouts/Mobile_view/ModelPage";
import SettingsPage from "./layouts/Mobile_view/settingspage";
import SigninPage from "./layouts/Mobile_view/Mobile_Signin_Page";

/* Desktop pages */
import DesktopViewHome from "./layouts/Desktop_view/Desktop_View_Home";
import DesktopSearchPage from "./layouts/Desktop_view/DesptopSearchPage"; // keep original file name
import ProfileDetailPage from './layouts/Desktop_view/ProfileDetailPage';
import MediaPartner from './layouts/Desktop_view/components/MediaPartner';

function App() {
  const { width } = useWindowSize();
  const { loading } = useAuth();
  const isMobile = width < 768;

  if (loading) return null;

  const RoutesWrapper = (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={isMobile ? <MobileViewHome /> : <DesktopViewHome />}
      />

      {/* Desktop pages */}
      {!isMobile && (
        <>
          <Route path="/directory" element={<DesktopSearchPage />} />
          <Route path="/profile/:id" element={<ProfileDetailPage />} />
          <Route path="/MediaPartner" element={<MediaPartner />} />
        </>
      )}

      {/* Mobile pages */}
      {isMobile && (
        <>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/modal" element={<ModelPage />} />
          <Route path="/settingspage" element={<SettingsPage />} />
          <Route path="/signinpage" element={<SigninPage />} />
        </>
      )}

      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <FavoritesProvider>
      {isMobile ? (
        <MobileLayout>{RoutesWrapper}</MobileLayout>
      ) : (
        <DesktopLayout>{RoutesWrapper}</DesktopLayout>
      )}
    </FavoritesProvider>
  );
}

export default App;
