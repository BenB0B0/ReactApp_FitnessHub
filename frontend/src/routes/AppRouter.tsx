// Handles all routes using React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Workouts from "../pages/Workouts";
import AIPlanner from "../pages/AIPlanner";
import Calendar from "../pages/Calendar";
import Stats from "../pages/Stats";
import NavBar from "../components/NavBar";
import ProtectedRoute from "../routes/ProtectedRoutes";
import { WorkoutProvider } from "../context/WorkoutContext";

export default function AppRouter() {
  return (
    <Router>
      <NavBar />
      <WorkoutProvider>
      <Routes>
        <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute> } />
        <Route path="/workouts" element={<ProtectedRoute> <Workouts /> </ProtectedRoute>} />
        <Route path="/ai-planner" element={<ProtectedRoute> <AIPlanner /> </ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute> <Calendar /> </ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute> <Stats /> </ProtectedRoute>} />
      </Routes>
      </WorkoutProvider>
    </Router>
  );
}
