import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, user, logout, isLoading } =
    useAuth0();
    const navigate = useNavigate();

    const handleClick = () => {
      navigate("/MainPage");
    };
  if (isLoading) return <p>טוען...</p>;

  return (
    <div dir="rtl" style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>ברוכים הבאים ל־ezGrading</h1>

      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>התחברות</button>
      ) : (
        <div>
          <h3>שלום, {user.name}</h3>
          <button  onClick={() => logout({ returnTo: window.location.origin })}>
            התנתקות
          </button>
          <br />
          <br />
          <Profile/>
          <button onClick={handleClick}>כניסה</button>
        </div>
      )}
    </div>
  );
}
