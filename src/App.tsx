import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadAnimationContext } from "./components/MyContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { LandingPage } from "./components/LandingPage";
import { LoadAnimation } from "./components/Animation/LoadAnimation";
import { useState } from "react";
import { Home } from "./components/Home";

function App() {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Router>
      <div id="main-container">
        <LoadAnimationContext.Provider value={{ loading, setLoading }}>
          <LoadAnimation />

          <Routes>
            <Route path="" element={<LandingPage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/home" element={<Home />} />
          </Routes>
        </LoadAnimationContext.Provider>
      </div>
    </Router>
  );
}

export default App;
