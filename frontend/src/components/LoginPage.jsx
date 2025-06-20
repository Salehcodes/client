import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../LoginPage.css";
import gmaillogo from "../assets/service2.png"; // Replace with actual Gmail-style logo if desired
import google from "../assets/google.png";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, user, logout, isLoading } =
    useAuth0();
  const navigate = useNavigate();

  // ✅ Auto-redirect to MainPage when logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/MainPage");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) return <p>טוען...</p>;

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <img className="logoImg" src={gmaillogo} alt="ezGrading logo" />
        <h1 className="login-title">שלום מורה</h1>
        <p className="login-subtitle">לכניסה לחשבון</p>

        {!isAuthenticated ? (
          <button className="login-button" onClick={() => loginWithRedirect()}>
           Google התחברות עם 
           <img src={google} alt="gmail login" className="google-icon"/>
          </button>
        ) : (
          <div>
            <p className="logged-in">שלום, {user.name}</p>
            <button
              className="login-button login-logout-button"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              התנתקות
            </button>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <h2 className="login-right-title">פשוט הרבה יותר מהיר</h2>
        <p className="login-right-desc">
          כי הזמן שלכם חשוב לנו — ezGrading יעזור לכם למפות ציונים במהירות רק
          באמצעות הקול שלכם אחרי כל מבחן.
        </p>
        <div className="top-buttons">
          <button className="join-button">Join Us</button>
          <button className="sign-up-link">Sign Up</button>
        </div>
      </div>
    </div>
  );
}
