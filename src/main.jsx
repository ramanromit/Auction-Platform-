import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import BidPage from "./pages/BidPage";
import Dashboard from "./pages/dashboard";
import SellItem from "./pages/SellItem";
import AuthPage from "./pages/AuthPage";
import { AuctionProvider } from "./context/AuctionContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <AuctionProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bid/:id" element={<BidPage />} />
            <Route path="/sell" element={<SellItem />} />
          </Routes>
        </AuctionProvider>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
