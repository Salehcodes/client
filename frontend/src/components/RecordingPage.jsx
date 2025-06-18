import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function RecordingPage() {
  const { state } = useLocation();
  /* after we sent the examname and question count with navigate from screen above we get it fusing uselocation */
  const navigate = useNavigate();
  const examName = state?.examName;
  const questionCount = state?.questionCount;

  const { getAccessTokenSilently } = useAuth0();

  const [studentName, setStudentName] = useState("");
  const [grades, setGrades] = useState(Array(questionCount).fill(""));
  const [transcript, setTranscript] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!examName || !questionCount) {
      alert("Missing exam details");
      navigate("/new-exam");
    }
  }, [examName, questionCount, navigate]);

  const flushAlerts = () => {
    if (alerts.length > 0) {
      alerts.forEach((msg) => alert(msg));
      setAlerts([]);
    }
  };

  const handleGradeChange = (index, value) => {
    const newGrades = [...grades];
    newGrades[index] = value;
    setGrades(newGrades);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      flushAlerts();
      setIsRecording(false);
    } else {
      if (!("webkitSpeechRecognition" in window)) {
        alert("Your browser does not support speech recognition");
        return;
      }

      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "he-IL";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        setTranscript(result);
        parseTranscript(result);
      };

      recognition.onerror = (e) => {
        console.error("🎙️ Speech Recognition Error:", e.error);
      };

      recognition.onend = () => {
        flushAlerts();
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    }
  };

  const hebrewNumberMap = {
    אפס: 0,
    אחת: 1,
    אחד: 1,
    שתיים: 2,
    שניים: 2,
    שלוש: 3,
    שלושה: 3,
    ארבע: 4,
    ארבעה: 4,
    חמש: 5,
    חמישה: 5,
    שש: 6,
    שישה: 6,
    שבע: 7,
    שבעה: 7,
    שמונה: 8,
    תשע: 9,
    תשעה: 9,
    עשר: 10,
    עשרה: 10,
    "אחת עשרה": 11,
    "אחד עשר": 11,
    "שתים עשרה": 12,
    "שנים עשר": 12,
    "שלוש עשרה": 13,
    "שלושה עשר": 13,
    "ארבע עשרה": 14,
    "ארבעה עשר": 14,
    "חמש עשרה": 15,
    "חמישה עשר": 15,
    "שש עשרה": 16,
    "שישה עשר": 16,
    "שבע עשרה": 17,
    "שבעה עשר": 17,
    "שמונה עשרה": 18,
    "שמונה עשר": 18,
    "תשע עשרה": 19,
    "תשעה עשר": 19,
    עשרים: 20,
    שלושים: 30,
    ארבעים: 40,
    חמישים: 50,
    שישים: 60,
    שבעים: 70,
    שמונים: 80,
    תשעים: 90,
    מאה: 100,
  };

  const parseTranscript = (text) => {
    const parts = text.trim().split(" ");

    const mappedParts = parts.map((p) => {
      if (hebrewNumberMap[p] !== undefined) return hebrewNumberMap[p];
      if (!isNaN(p)) return Number(p);
      return p;
    });

    const numbers = mappedParts.filter((p) => typeof p === "number");
    const nameParts = mappedParts.filter((p) => typeof p === "string");

    if (numbers.length !== questionCount) {
      setAlerts((prev) => [
        ...prev,
        "Number of grades does not match number of questions",
      ]);
      return;
    }

    const name = nameParts.join(" ");
    setStudentName(name);
    setGrades(numbers);
  };

  const handleNextStudent = useCallback(async () => {
    if (
      !studentName ||
      grades.some((g) => {
        const num = Number(g);
        return (
          g === "" || // Empty input
          num < 0
        );
      })
    ) {
      alert("Please fill in student name and all grades");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:5000/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: studentName,
          grades: grades.map(Number),
          exam: examName,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setStudentName("");
      setGrades(Array(questionCount).fill(""));
      setTranscript("");
    } catch (err) {
      alert("Failed to send to server");
      console.error(err);
    }
  }, [studentName, grades, examName, getAccessTokenSilently, questionCount]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleNextStudent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextStudent]);

  const handleFinishExam = () => {
    navigate("/");
  };

  return (
    <div dir="rtl" style={{ textAlign: "center", padding: "40px" }}>
      <h2>מבחן: {examName}</h2>

      <div style={{ margin: "10px" }}>
        <label>שם תלמיד:</label>
        <br />
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        {grades.map((grade, i) => (
          <div key={i} style={{ margin: "10px" }}>
            <label>שאלה {i + 1}:</label>
            <input
              type="number"
              value={grade}
              onChange={(e) => handleGradeChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button onClick={handleToggleRecording} style={{ marginTop: "20px" }}>
        {isRecording ? "⏹️ Stop Recording" : "🎤 Start Recording"}
      </button>

      <p>{transcript && `Heard: ${transcript}`}</p>

      <button onClick={handleNextStudent}>Next (Save Student)</button>
      <br />
      <br />
      <button onClick={handleFinishExam}>Finish Exam</button>
    </div>
  );
}
