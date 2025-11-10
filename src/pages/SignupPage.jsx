import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  const handleSignup = async formData => {
    console.log("Signup data:", formData);
  };

  return <SignupForm onSubmit={handleSignup} />;
}
