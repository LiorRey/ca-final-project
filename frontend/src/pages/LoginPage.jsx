import { LoginForm } from "../components/LoginForm";
import { login } from "../store/actions/auth-actions";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  async function handleLogin(credentials) {
    try {
      await login(credentials);
      navigate("/board");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  return <LoginForm onSubmit={handleLogin} />;
}
