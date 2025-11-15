import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import { AuthFormLayout } from "./auth/AuthFormLayout";
import { FormField } from "./forms/FormField";
import { PasswordField } from "./forms/PasswordField";
import { validationRules } from "../services/forms/validation-service";

export function LoginForm({ onSubmit }) {
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleFormSubmit(data) {
    try {
      await onSubmit(data);
      throw new Error("Login action not implemented yet");
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.message || "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <AuthFormLayout
      title="Log in to your account"
      submitStatus={submitStatus}
      onStatusClose={() => setSubmitStatus(null)}
      footerContent={
        <Typography className="auth-footer-links">
          <Link href="/forgot-password">Can't log in?</Link>
          {" • "}
          <RouterLink to="/signup">Create an account</RouterLink>
        </Typography>
      }
    >
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
      >
        <FormField
          name="email"
          control={control}
          errors={errors}
          label="Email address"
          placeholder="Enter email address"
          rules={validationRules.email}
        />

        <PasswordField
          name="password"
          control={control}
          errors={errors}
          label="Password"
          placeholder="Enter password"
          rules={validationRules.password.login}
        />

        <Box className="auth-form-field">
          <FormControlLabel
            className="auth-checkbox"
            control={<Checkbox />}
            label="Remember me"
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          className="auth-continue-button"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Please wait..." : "Log in"}
        </Button>
      </Box>
    </AuthFormLayout>
  );
}
