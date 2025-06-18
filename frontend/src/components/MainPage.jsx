import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../MainPage.css";
const API_BASE = import.meta.env.VITE_SERVER_URI;
export default function MainPage() {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } =
    useAuth0();
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE}/grades/exams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    if (isAuthenticated) {
      fetchExams();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleDownload = async (examName) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${API_BASE}/grades/export?exam=${encodeURIComponent(examName)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grades-${examName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("ההורדה נכשלה");
    }
  };

  const handleAddExam = () => {
    navigate("/new-exam");
  };

  if (isLoading) return <p>טוען...</p>;

  return (
    <div className="main-page">
      <h1>שלום, {user?.name}</h1>
      {user?.picture && (
        <img src={user.picture} alt={user.name} className="user-image" />
      )}
      <br />
      <br />
      <button onClick={handleAddExam} className="add-exam-button">
        הוספת מבחן חדש
      </button>

      <h2>המבחנים הקודמים שלך</h2>

      {exams.length === 0 ? (
        <p>אין מבחנים שמורים עדיין.</p>
      ) : (
        <table className="exam-table">
          <thead>
            <tr>
              <th className="table-header">שם מבחן</th>
              <th className="table-header">הורדה</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, i) => (
              <tr key={i}>
                <td className="table-cell">{exam}</td>
                <td className="table-cell">
                  <button
                    onClick={() => handleDownload(exam)}
                    className="download-button"
                  >
                    ⬇️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
