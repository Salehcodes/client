import React from "react";
import "./index.css";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewExamPage from "./components/NewExamPage";
import RecordingPage from "./components/RecordingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/new-exam" element={<NewExamPage />} />
        <Route path="/record" element={<RecordingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
