import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormField } from "./FormField";

export function PasswordField({
  name,
  control,
  errors,
  label,
  placeholder,
  rules,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        onClick={togglePasswordVisibility}
        className="auth-password-toggle"
        edge="end"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <FormField
      name={name}
      control={control}
      errors={errors}
      label={label}
      placeholder={placeholder}
      type={showPassword ? "text" : "password"}
      rules={rules}
      endAdornment={endAdornment}
      {...props}
    />
  );
}
