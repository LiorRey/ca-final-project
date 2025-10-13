import { Routes, Route } from "react-router";
import { Provider } from "react-redux";

import { store } from "./store/store.js";
import { AppHeader } from "./components/AppHeader.jsx";
import { UserMessage } from "./components/UserMessage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { AboutUs, AboutTeam, AboutVision } from "./pages/AboutUs.jsx";
import { BoardIndex } from "./pages/BoardIndex.jsx";
import { BoardDetails } from "./pages/BoardDetails.jsx";
import { CardDetails } from "./pages/CardDetails.jsx";
import { UserDetails } from "./pages/UserDetails.jsx";
import { ChatApp } from "./pages/Chat.jsx";
import { AdminIndex } from "./pages/AdminIndex.jsx";
import { LoginSignup, Login, Signup } from "./pages/LoginSignup.jsx";
import { AppFooter } from "./components/AppFooter.jsx";

export function App() {
  return (
    <Provider store={store}>
      <div className="main-container">
        <AppHeader />
        <UserMessage />

        <main>
          <Routes>
            <Route path="" element={<HomePage />} />
            <Route path="about" element={<AboutUs />}>
              <Route path="team" element={<AboutTeam />} />
              <Route path="vision" element={<AboutVision />} />
            </Route>
            <Route path="board" element={<BoardIndex />} />
            <Route path="board/:boardId" element={<BoardDetails />} />
            <Route
              path="board/:boardId/:groupId/:cardId"
              element={<CardDetails />}
            />
            <Route path="user/:userId" element={<UserDetails />} />
            <Route path="chat" element={<ChatApp />} />
            <Route path="admin" element={<AdminIndex />} />
            <Route path="auth" element={<LoginSignup />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Provider>
  );
}
