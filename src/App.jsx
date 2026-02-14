import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/dashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
