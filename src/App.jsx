import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/dashboard";
import SellItem from "./pages/SellItem";
import { AuctionProvider } from "./context/AuctionContext";

function App() {
  return (
    <AuctionProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sell" element={<SellItem />} />
      </Routes>
    </AuctionProvider>
  );
}

export default App;
