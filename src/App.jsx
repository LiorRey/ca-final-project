import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { UserMessage } from "./components/UserMessage";
import { HomePage } from "./pages/HomePage";
import { AboutUs, AboutTeam, AboutVision } from "./pages/AboutUs";
import { BoardIndex } from "./pages/BoardIndex";
import { BoardDetails } from "./pages/BoardDetails";
import { CardDetails } from "./pages/CardDetails";
import { UserDetails } from "./pages/UserDetails";
import { ChatApp } from "./pages/Chat";
import { AdminIndex } from "./pages/AdminIndex";
import { Login } from "./pages/LoginSignup";
import { SignupPage } from "./pages/SignupPage";

export function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

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
          <Route path="chat" element={<ChatApp />} />
          <Route path="admin" element={<AdminIndex />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<Login />} />
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
