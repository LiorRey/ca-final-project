import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthFormLayout } from "./auth/AuthFormLayout";

export function LoginForm({ onSubmit }) {
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
            Password
          </Typography>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                fullWidth
                variant="outlined"
                className="auth-text-field"
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          className="auth-password-toggle"
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </Box>

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
