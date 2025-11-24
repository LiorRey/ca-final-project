import Button from "@mui/material/Button";

export function ActionButton({ sx = {}, selected, children, ...props }) {
  return (
    <Button
      size="small"
      variant="contained"
      sx={{
        fontWeight: "bold",
        textDecoration: "none",
        color: selected
          ? "var(--action-btn-color-active)"
          : "var(--action-btn-color-default)",
        backgroundColor: selected
          ? "var(--action-btn-bg-active)"
          : "var(--action-btn-bg-default)",
        "&:hover": {
          backgroundColor: selected
            ? "var(--action-btn-bg-active)"
            : "var(--action-btn-bg-hover)",
          color: selected
            ? "var(--action-btn-color-active)"
            : "var(--action-btn-color-hover)",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
