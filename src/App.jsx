// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useWindowSize } from "./hooks/useWindowSize";
import { useAuth } from "./context/AuthContext";

import MobileLayout from "./layouts/Mobile_view/Mobile_layout";
import DesktopLayout from "./layouts/Desktop_view/Desktop_layout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

import MobileViewHome from "./layouts/Mobile_view/Mobile_View_Home";
import SearchPage from "./layouts/Mobile_view/SearchPage"; 

import DesktopLogin from "./pages/auth/DesktopLogin";

import ModelPage from "./layouts/Mobile_view/ModelPage";
import SettingsPage from "./layouts/Mobile_view/settingspage";
import SigninPage from "./layouts/Mobile_view/Mobile_Signin_Page";

function App() {
  const { width } = useWindowSize();
  const { user, loading } = useAuth();
  const isMobile = width < 768;

  if (loading) return null; // Or a full-screen loader

  const RoutesWrapper = (
    <Routes>
      {/* Mobile Home */}
      <Route
        path="/"
        element={
          isMobile
            ? <MobileViewHome />
            : user
              ? <Navigate to="/dashboard" />
              : <DesktopLogin />
        }
      />

      {isMobile && <Route path="/search" element={<SearchPage />} />}
      {isMobile && <Route path="/Modal" element={<ModelPage />} />}
      {isMobile && <Route path="/settingspage" element={<SettingsPage />} />}
      {isMobile && <Route path="/SigninPage" element={<SigninPage />} />}


      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  return isMobile ? (
    <MobileLayout>{RoutesWrapper}</MobileLayout>
  ) : (
    <DesktopLayout>{RoutesWrapper}</DesktopLayout>
  );
}

export default App;