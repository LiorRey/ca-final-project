import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { UserMessage } from "./components/UserMessage";
import { AdminIndex } from "./pages/AdminIndex";
import { AboutUs, AboutTeam, AboutVision } from "./pages/AboutUs";
import { BoardDetails } from "./pages/BoardDetails";
import { BoardIndex } from "./pages/BoardIndex";
import { CardDetails } from "./pages/CardDetails";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
// import { Login } from "./pages/LoginSignup";
import { SignupPage } from "./pages/SignupPage";
import { ThemeComparison } from "./pages/ThemeComparison";
import { UserDetails } from "./pages/UserDetails";
import { restoreSession } from "./store/actions/auth-actions";

export function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <div className="main-container">
      <Header />
      <UserMessage />

      <main>
        <Routes location={backgroundLocation || location}>
          <Route path="" element={<HomePage />} />
          <Route path="about" element={<AboutUs />}>
            <Route path="team" element={<AboutTeam />} />
            <Route path="vision" element={<AboutVision />} />
          </Route>
          <Route path="board" element={<BoardIndex />} />
          <Route path="board/:boardId" element={<BoardDetails />} />
          <Route path="user/:userId" element={<UserDetails />} />
          <Route path="admin" element={<AdminIndex />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="board/:boardId/:listId/:cardId"
            element={<CardDetails />}
          />
          <Route path="theme-comparison" element={<ThemeComparison />} />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route
              path="board/:boardId/:listId/:cardId"
              element={<CardDetails />}
            />
          </Routes>
        )}
      </main>
    </div>
  );
}
