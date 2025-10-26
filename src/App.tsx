import Hero from "./components/Hero"
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./components/VerifyEmail";
import NicheQuestionnaire from "./pages/NicheQuestionnaire";
import Niche from "./pages/Niche";
import IdeasTab from "./pages/IdeasTab";
import PromptTab from "./pages/PromptTab";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/niche-questionnaire" element={<NicheQuestionnaire />} />
        <Route path="/niche" element={< Niche />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/ideas" element={<IdeasTab/>} />
        <Route path="/prompt" element={<PromptTab/>} />
      </Routes>
    </Router>
  )
}

export default App
