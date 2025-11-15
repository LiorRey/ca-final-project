import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

export function FormField({
  name,
  control,
  errors = {},
  label,
  placeholder,
  type = "text",
  rules,
  className = "auth-form-field",
  labelClassName = "auth-form-label",
  fieldClassName = "auth-text-field",
  endAdornment,
  startAdornment,
  renderCustomField,
  helperContent,
  ...props
}) {
  return (
    <Box className={className}>
      {label && (
        <Typography className={labelClassName} component="label">
          {label}
        </Typography>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          if (renderCustomField) {
            return renderCustomField({ field, errors });
          }

          return (
            <TextField
              {...field}
              type={type}
              placeholder={placeholder}
              fullWidth
              variant="outlined"
              className={fieldClassName}
              error={!!errors[name]}
              helperText={errors[name]?.message}
              slotProps={{
                input: {
                  startAdornment,
                  endAdornment,
                },
              }}
              {...props}
            />
          );
        }}
      />
      {helperContent}
    </Box>
  );
}
