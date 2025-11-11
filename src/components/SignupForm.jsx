import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const strengthLevels = {
  0: {
    message: "Password must have at least 8 characters",
    className: "strength-neutral",
  },
  1: {
    message: "Weak",
    className: "strength-weak",
  },
  2: {
    message: "Fair",
    className: "strength-fair",
  },
  3: {
    message: "Good",
    className: "strength-good",
  },
  4: {
    message: "Strong",
    className: "strength-strong",
  },
  5: {
    message: "Very strong",
    className: "strength-very-strong",
  },
};

export function SignupForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  });

  function calculatePasswordStrength(password) {
    if (!password || password.length < 8) {
      return {
        strength: 0,
        message: strengthLevels[0].message,
        className: strengthLevels[0].className,
        neutral: true,
      };
    }

    const length = password.length;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    let score = 0;
    let criteriaCount = 0;

    if (hasLowercase) criteriaCount++;
    if (hasUppercase) criteriaCount++;
    if (hasDigit) criteriaCount++;
    if (hasSpecialChar) criteriaCount++;

    if (length >= 8 && length < 10) {
      score = criteriaCount < 2 ? 1 : 2;
    } else if (length >= 10 && length < 12) {
      score = criteriaCount < 3 ? 2 : 3;
    } else if (length >= 12 && length < 16) {
      score = criteriaCount < 3 ? 3 : 4;
    } else if (length >= 16) {
      score = criteriaCount === 4 ? 5 : 4;
    }

    const mappedScore = Math.max(0, Math.min(score, 5));
    return {
      strength: mappedScore,
      message: strengthLevels[mappedScore].message,
      className: strengthLevels[mappedScore].className,
      neutral: mappedScore === 0,
    };
  }

  const watchedPassword = useWatch({ control, name: "password" });
  const passwordStrength = calculatePasswordStrength(watchedPassword || "");

  const handleFormSubmit = async data => {
    try {
      await onSubmit(data);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Box className="auth-container">
      <Container className="auth-wrapper" maxWidth={false}>
        <Box className="auth-card">
          <Box className="auth-header">
            <Typography className="auth-title" component="h1">
              Sign up for your account
            </Typography>
          </Box>

          {submitStatus && (
            <Alert
              severity={submitStatus.type}
              onClose={() => setSubmitStatus(null)}
              sx={{ mb: 2 }}
            >
              {submitStatus.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
          >
            <Box className="auth-form-field">
              <Typography className="auth-form-label" component="label">
                Email address
              </Typography>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter email address"
                    fullWidth
                    variant="outlined"
                    className="auth-text-field"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Box>

            <Box className="auth-form-field">
              <Typography className="auth-form-label" component="label">
                Full name
              </Typography>
              <Controller
                name="fullName"
                control={control}
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter full name"
                    fullWidth
                    variant="outlined"
                    className="auth-text-field"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Box>

            <Box className="auth-form-field">
              <Typography className="auth-form-label" component="label">
                Password
              </Typography>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password must have at least 8 characters",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    fullWidth
                    variant="outlined"
                    className="auth-text-field"
                    error={!!errors.password}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              className="auth-password-toggle"
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />

              <Box className="auth-password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4, 5].map(barIndex => (
                    <div
                      key={barIndex}
                      className={`strength-bar ${
                        watchedPassword &&
                        !passwordStrength.neutral &&
                        barIndex <= passwordStrength.strength
                          ? strengthLevels[passwordStrength.strength].className
                          : strengthLevels[0].className
                      }`}
                      data-bar={barIndex}
                    />
                  ))}
                </div>
                <div className="strength-text strength-text-gray strength-text-center">
                  {errors.password
                    ? errors.password.message
                    : passwordStrength.message}
                </div>
              </Box>
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

          <Box className="auth-footer">
            <Typography className="auth-login-link">
              Already have an account?{" "}
              <RouterLink to="/login">Log in</RouterLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
