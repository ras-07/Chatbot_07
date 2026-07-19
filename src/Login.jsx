import React, { useState } from 'react';
import { auth } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, // Add this for new users
  GoogleAuthProvider, 
  signInWithPopup, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import './App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false); // New state to toggle mode

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        if (isSignup) {
          // Logic for Sign Up
          return createUserWithEmailAndPassword(auth, email, password)
            .then(() => alert("Account Created Successfully!"));
        } else {
          // Logic for Log In
          return signInWithEmailAndPassword(auth, email, password);
        }
      })
      .catch((error) => alert(error.message));
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => console.log("Google User:", result.user))
      .catch((error) => alert(error.message));
  };

  return (
    <div className="insta-login-container">
      <div className="auth-box">
        {/* Dynamic Title */}
        <h1 className="brand-logo">{isSignup ? "Create Account" : "Trace AI"}</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          {/* Dynamic Button Text */}
          <button type="submit" className="login-button">
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="separator">
          <div className="line"></div>
          <div className="or-text">OR</div>
          <div className="line"></div>
        </div>

        <button onClick={handleGoogleLogin} className="google-login-btn">
          <span className="google-icon">G</span> {isSignup ? "Sign up with Google" : "Log in with Google"}
        </button>

        {!isSignup && <a href="#" className="forgot-password">Forgot password?</a>}
      </div>

      <div className="signup-box">
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(!isSignup); }}>
            {isSignup ? " Log in" : " Sign up"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;