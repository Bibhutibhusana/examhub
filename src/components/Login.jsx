import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Login.css';

const Login = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Check user role and redirect accordingly
      const checkUserRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'ADMIN') {
              navigate('/admin-dashboard');
            } else {
              navigate('/student-dashboard');
            }
          }
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      };
      checkUserRole();
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user profile exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create user profile if it doesn't exist (for students)
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || '',
          role: 'STUDENT',
          subscriptionType: 'free',
          examCount: 0,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      } else {
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date()
        }, { merge: true });
      }

      // Store user info in localStorage
      const userData = userDoc.exists() ? userDoc.data() : { role: 'STUDENT' };
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        role: userData.role
      }));
      localStorage.setItem('studentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        role: userData.role
      }));

      // Redirect based on role
      if (userData.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      console.log('Starting Google login...');
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('email');
      provider.addScope('profile');

      console.log('Calling signInWithPopup...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google login successful for user:', user.email);

      // Check if user profile exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        console.log('Creating new user profile in Firestore...');
        // Create user profile if it doesn't exist (for students)
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || '',
          role: 'STUDENT',
          subscriptionType: 'free',
          examCount: 0,
          createdAt: new Date(),
          lastLogin: new Date()
        });
        console.log('User profile created successfully');
      } else {
        console.log('Updating last login for existing user...');
        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date()
        }, { merge: true });
        console.log('Last login updated successfully');
      }

      // Store user info in localStorage
      const userData = userDoc.exists() ? userDoc.data() : { role: 'STUDENT' };
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        role: userData.role
      }));
      localStorage.setItem('studentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        role: userData.role
      }));
      console.log('User data stored in localStorage');

      // Redirect based on role
      if (userData.role === 'ADMIN') {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin-dashboard');
      } else {
        console.log('Redirecting to student dashboard...');
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      let errorMessage = 'Google login failed. Please try again.';
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled in Firebase. Please enable it in your Firebase console.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another popup is already open. Please close it and try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p className="login-subtitle">Secure access to admin dashboard</p>

        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} className="google-btn">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
          Continue with Google
        </button>

        <div className="auth-links">
          <p>Don't have an account? <a href="/student-register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
