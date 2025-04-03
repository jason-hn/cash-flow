import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuthStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);

  useEffect(() => {
    console.log("Login component mounted");
    console.log("Google client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
    
    let timeoutId;
    let retryCount = 0;
    const MAX_RETRIES = 1000;
    
    const loadGoogleScript = () => {
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        setIsGoogleLoading(false);
      };
      document.body.appendChild(script);
    };

    const initializeGoogle = () => {
      console.log("Initializing Google Sign-In...", retryCount);
      console.log("Google object available:", !!window.google);
      
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn
        });

        const googleButton = document.getElementById('googleSignInDiv');
        console.log("Found button container:", !!googleButton);
        
        if (googleButton) {
          try {
            window.google.accounts.id.renderButton(
              googleButton,
              { 
                theme: 'outline', 
                size: 'large', 
                width: 300,
                text: 'continue_with'
              }
            );
            console.log("Button render call completed");
            setIsGoogleLoading(false);
            return; // Success - exit the function
          } catch (error) {
            console.error("Error rendering button:", error);
          }
        }
        
        // If we got here, either button wasn't found or rendering failed
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Retry attempt ${retryCount}/${MAX_RETRIES}`);
          timeoutId = setTimeout(initializeGoogle, 300);
        } else {
          console.error("Max retries reached, giving up");
          setIsGoogleLoading(false);
        }
      } else {
        timeoutId = setTimeout(initializeGoogle, 100);
      }
    };

    loadGoogleScript();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    try {
      const res = await api.post('/auth/google', {
        credential: response.credential
      });
      
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      useAuthStore.setState({ user, token, isLoading: false });
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert(error.response?.data?.message || 'Google sign-in failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await useAuthStore.getState().login(email, password);
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-[400px] w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">CashFlow</h1>
          <p className="text-gray-600">Smart Money Management, Simplified</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="w-full flex justify-center">
          {isGoogleLoading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-900"></div>
          )}
          <div 
            id="googleSignInDiv" 
            className={isGoogleLoading ? "hidden" : ""} 
          />
        </div>

        <div className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-900 hover:text-indigo-800">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
} 