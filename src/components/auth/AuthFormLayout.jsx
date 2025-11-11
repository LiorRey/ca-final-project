import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

export function AuthFormLayout({
  title,
  children,
  footerContent,
  submitStatus,
  onStatusClose,
}) {
  return (
    <Box className="auth-container">
      <Container className="auth-wrapper" maxWidth={false}>
        <Box className="auth-card">
          <Box className="auth-header">
            <Typography className="auth-title" component="h1">
              {title}
            </Typography>
          </Box>

          {submitStatus && (
            <Alert
              severity={submitStatus.type}
              onClose={onStatusClose}
              sx={{ mb: 2 }}
            >
              {submitStatus.message}
            </Alert>
          )}

          {children}

          {footerContent && <Box className="auth-footer">{footerContent}</Box>}
        </Box>
      </Container>
    </Box>
  );
}
