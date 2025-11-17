import { useNavigate } from "react-router";

import { SignupForm } from "../components/SignupForm";
import { signup } from "../store/actions/auth-actions";

export function SignupPage() {
  const navigate = useNavigate();

  async function handleSignup(userData) {
    try {
      await signup(userData);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  return <SignupForm onSubmit={handleSignup} />;
}
