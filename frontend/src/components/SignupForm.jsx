import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { PasswordStrengthIndicator } from "./forms/PasswordStrengthIndicator";
import { validationRules } from "../services/forms/validation-service";
import { calculatePasswordStrength } from "../services/forms/form-utils";

export function SignupForm({ onSubmit }) {
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
    },
  });

  const watchedPassword = useWatch({ control, name: "password" });
  const passwordStrength = calculatePasswordStrength(watchedPassword || "");

  async function handleFormSubmit(data) {
    try {
      await onSubmit(data);
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
      title="Sign up for your account"
      submitStatus={submitStatus}
      onStatusClose={() => setSubmitStatus(null)}
      footerContent={
        <Typography className="auth-login-link">
          Already have an account? <RouterLink to="/login">Log in</RouterLink>
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

        <FormField
          name="fullname"
          control={control}
          errors={errors}
          label="Full name"
          placeholder="Enter full name"
          rules={validationRules.fullname}
        />

        <Box className="auth-form-field">
          <PasswordField
            name="password"
            control={control}
            errors={errors}
            label="Password"
            placeholder="Create password"
            rules={validationRules.password.signup}
          />

          <PasswordStrengthIndicator
            strength={passwordStrength.strength}
            message={
              errors.password
                ? errors.password.message
                : passwordStrength.message
            }
            neutral={passwordStrength.neutral}
            password={watchedPassword}
          />
        </Box>

        <Box className="auth-form-field">
          <FormControlLabel
            className="auth-checkbox"
            control={<Checkbox />}
            label="Yes! Send me news and offers about products, events, and more."
          />
        </Box>

        <Typography className="auth-legal-text">
          By signing up, I accept the{" "}
          <Link href="/terms" target="_blank">
            Terms of Service
          </Link>{" "}
          and acknowledge the{" "}
          <Link href="/privacy" target="_blank">
            Privacy Policy
          </Link>
          .
        </Typography>

        <Button
          type="submit"
          fullWidth
          className="auth-continue-button"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Please wait..." : "Continue"}
        </Button>
      </Box>
    </AuthFormLayout>
  );
}
