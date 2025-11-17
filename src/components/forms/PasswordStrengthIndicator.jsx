import Box from "@mui/material/Box";
import { getStrengthLevel } from "../../services/forms/form-utils";

export function PasswordStrengthIndicator({
  strength,
  message,
  neutral,
  password,
}) {
  const strengthLevel = getStrengthLevel(strength);
  const neutralLevel = getStrengthLevel(0);

  return (
    <Box className="auth-password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map(barIndex => (
          <div
            key={barIndex}
            className={`strength-bar ${
              password && !neutral && barIndex <= strength
                ? strengthLevel.className
                : neutralLevel.className
            }`}
            data-bar={barIndex}
          />
        ))}
      </div>
      <div className="strength-text strength-text-gray strength-text-center">
        {message}
      </div>
    </Box>
  );
}
