// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient'; // Your shared Supabase client
import '../Mobile_view/Mobile_css/settingspage.css';
import {
  Person,
  Login,
  PersonAdd,
  MonetizationOn,
  Search,
  AdminPanelSettings,
  NotificationsOutlined,
  SubscriptionsOutlined,
  Logout,
  ArrowForwardIos,
} from '@mui/icons-material'; // Using Material UI icons (install: npm install @mui/icons-material)

const SettingsPage = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    loadUserProfile();
    checkAdmin();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage; // Use localStorage instead of SharedPreferences
      const cachedUserName = stored.getItem('username');
      const userId = stored.getItem('userId');

      setDisplayName(cachedUserName || null);
      setIsSignedIn(!!userId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdmin = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      setIsAdmin(data?.is_admin === true);
    } catch (e) {
      console.error('Admin check error:', e);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Keep favorites if needed (you can adapt this)
      const favorites = JSON.parse(localStorage.getItem('favorites_') || '[]');
      localStorage.clear();
      localStorage.setItem('favorites_', JSON.stringify(favorites));

      navigate('/', { replace: true });
    } catch (e) {
      alert('Logout failed: ' + e.message);
    }
  };

  const showLoginRequired = () => {
    if (window.confirm('You need to log in to access this feature.')) {
      navigate('/signin');
    }
  };

  if (isLoading) {
    return (
      <div className="settings-page loading">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  const showAuth = !isSignedIn;

  return (
    <div className="settings-page">
      {/* <header className="settings-header">
        <h1>Settings</h1>
      </header> */}

      <div className="settings-content">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="avatar">
            {(displayName || 'U')[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{displayName || 'Guest User'}</h2>
            <p>{isSignedIn ? 'Welcome back!' : 'Sign in to unlock features'}</p>
          </div>
        </div>

        {/* Guest Auth Options */}
        {showAuth && (
          <div className="auth-cards">
            <div className="action-card" onClick={() => navigate('/SigninPage')}>
              <div className="icon-bg blue">
                <Login fontSize="large" />
              </div>
              <span>Sign In</span>
              <ArrowForwardIos className="arrow" />
            </div>

            <div className="action-card" onClick={() => navigate('/signup')}>
              <div className="icon-bg green">
                <PersonAdd fontSize="large" />
              </div>
              <span>Sign Up</span>
              <ArrowForwardIos className="arrow" />
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="menu-list">
          <div
            className="menu-item"
            onClick={() => (isSignedIn ? navigate('/profile-settings') : showLoginRequired())}
          >
            <div className="icon-bg blue">
              <Person fontSize="large" />
            </div>
            <span>Profile Settings</span>
            <ArrowForwardIos className="arrow" />
          </div>

          {isSignedIn && (
            <div className="menu-item" onClick={() => navigate('/media-partner')}>
              <div className="icon-bg orange">
                <MonetizationOn fontSize="large" />
              </div>
              <span>Media Partner</span>
              <ArrowForwardIos className="arrow" />
            </div>
          )}

          {isSignedIn && (
            <div className="menu-item" onClick={() => navigate('/find-number')}>
              <div className="icon-bg teal">
                <Search fontSize="large" />
              </div>
              <span>Find Number</span>
              <ArrowForwardIos className="arrow" />
            </div>
          )}

          {isAdmin && (
            <div className="menu-item" onClick={() => navigate('/admin-panel')}>
              <div className="icon-bg purple">
                <AdminPanelSettings fontSize="large" />
              </div>
              <span>Admin Panel</span>
              <ArrowForwardIos className="arrow" />
            </div>
          )}

          <div className="menu-item" onClick={() => {}}>
            <div className="icon-bg blue">
              <NotificationsOutlined fontSize="large" />
            </div>
            <span>Notification Settings</span>
            <ArrowForwardIos className="arrow" />
          </div>

          <div
            className="menu-item"
            onClick={() => (isSignedIn ? navigate('/subscription') : showLoginRequired())}
          >
            <div className="icon-bg deep-orange">
              <SubscriptionsOutlined fontSize="large" />
            </div>
            <span>Subscription Plan</span>
            <ArrowForwardIos className="arrow" />
          </div>

          {isSignedIn && (
            <div className="action-card logout-card" onClick={handleLogout}>
              <div className="icon-bg red">
                <Logout fontSize="large" />
              </div>
              <span>Logout</span>
              <ArrowForwardIos className="arrow" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;