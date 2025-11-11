import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  async function handleLogin(credentials) {
    try {
      // TODO: Implement login action when ready
      console.log("Login credentials:", credentials);
      // await login(credentials);
      // navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  return <LoginForm onSubmit={handleLogin} />;
}
