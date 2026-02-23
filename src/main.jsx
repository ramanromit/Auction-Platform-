import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import BidPage from "./pages/BidPage";
import Dashboard from "./pages/dashboard";
import SellItem from "./pages/SellItem";
import AuthPage from "./pages/AuthPage";
import { AuctionProvider } from "./context/AuctionContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
