import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function NewExamPage() {
  const [examName, setExamName] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

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
        `http://localhost:5000/grades/check-exam?name=${encodeURIComponent(
          examName
        )}`,
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
    <div dir="rtl" style={{ textAlign: "center", padding: "40px" }}>
      <h2>מבחן חדש</h2>

      <div style={{ margin: "20px" }}>
        <label>שם המבחן:</label>
        <br />
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
        />
      </div>

      <div style={{ margin: "20px" }}>
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
  );
}
