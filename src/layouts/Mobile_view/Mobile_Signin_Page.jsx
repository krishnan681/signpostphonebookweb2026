// src/pages/SigninPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient'; // Your shared client
import '../Mobile_view/Mobile_css/Mobile_Signin_Page.css';

const SigninPage = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateMobile = (value) => {
    if (!value) return 'Enter mobile number';
    if (!/^[6-9]\d{9}$/.test(value)) {
      return 'Enter valid 10-digit Indian mobile number';
    }
    return '';
  };

  const handleSignIn = async () => {
    const validationError = validateMobile(mobile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if mobile exists in profiles table
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, business_name, person_name')
        .eq('mobile_number', mobile.trim())
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
        throw fetchError;
      }

      if (!profile) {
        // Not registered → Show alert-like behavior with confirm
        const shouldSignup = window.confirm(
          'This mobile number is not registered. Please sign up to continue.'
        );
        if (shouldSignup) {
          navigate('/signup', { replace: true });
        }
        setIsLoading(false);
        return;
      }

      // Resolve display name
      const business = profile.business_name?.trim();
      const person = profile.person_name?.trim();
      const username = business && business.length > 0 ? business : (person || '');
      const userId = profile.id.toString();

      // Save to localStorage (equivalent to SharedPreferences)
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);

      // Ensure users_table row exists (upsert-like behavior)
      try {
        const { data: existing } = await supabase
          .from('users_table')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (!existing) {
          await supabase.from('users_table').insert({
            user_id: userId,
            user_name: username,
          });
        }
      } catch (e) {
        console.error('Error ensuring users_table row:', e);
      }

      console.log(`Logged in as ${username} (${userId})`);

      // Navigate to home
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldError = validateMobile(mobile);

  return (
    <div className="signin-page">
      <div className="signin-container">
        {/* Logo */}
        <div className="logo-circle">
          <span className="phone-icon">📱</span>
        </div>

        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">
          Sign in with your registered mobile number
        </p>

        {/* Form Card */}
        <div className="form-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
          >
            <div className="input-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                type="tel"
                placeholder="Enter 10-digit number"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setError('');
                }}
                className={fieldError || error ? 'error' : ''}
                maxLength="10"
              />
              {(fieldError || error) && (
                <span className="error-text">{fieldError || error}</span>
              )}
            </div>

            <button
              type="submit"
              className="signin-btn"
              disabled={isLoading || !!fieldError}
            >
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="signup-link">
            <span>New to Celfone5G+? </span>
            <button
              onClick={() => navigate('/signup', { replace: true })}
              className="link-btn"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;