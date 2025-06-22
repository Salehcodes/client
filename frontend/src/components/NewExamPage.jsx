import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
const API_BASE = import.meta.env.VITE_SERVER_URI;
import ezGrading from "../assets/service2.png";
import Footer from "../components/Footer";
import "../NewExamPage.css";

export default function NewExamPage() {
  const [examName, setExamName] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const navigate = useNavigate();
  const { user, getAccessTokenSilently, isAuthenticated, isLoading, logout } =
    useAuth0();
  const parsedCount = Number(questionCount);

  const handleStartRecording = async () => {
    if (
      !examName ||
      !questionCount ||
      !Number.isInteger(parsedCount) ||
      parsedCount <= 0
    ) {
      alert("נא למלא שם מבחן וכמות שאלות תקינה");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `${API_BASE}/grades/check-exam?name=${encodeURIComponent(examName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.exists) {
        alert("כבר קיים מבחן עם שם זה. נא לבחור שם אחר.");
        return;
      }

      navigate("/record", {
        state: {
          examName,
          questionCount: parsedCount,
        },
      });
    } catch (err) {
      console.error("שגיאה בבדיקת שם המבחן:", err);
      alert("אירעה שגיאה בבדיקת שם המבחן");
    }
  };

  return (
    <div className="newExamPage">
      <div className="newCont">
      <div className="myheader"
             style={{backgroundColor: "white", display: "flex", margin:"0",flexDirection: "row-reverse" }}
           >
             <img className="Logoimg" src={ezGrading} alt="ezGrading" />
           </div>
      <br />

      <h2>מבחן חדש</h2>

      <div className="input-block">
        <label>שם המבחן:</label>
        <br />
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />
      </div>

      <div className="input-block">
        <label>מספר שאלות:</label>
        <br />
        <input
          type="number"
          min="1"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        />
      </div>

      <button onClick={handleStartRecording}>בוא נתחיל להקליט</button>
      </div>
      <Footer />
    </div>
  );
}
