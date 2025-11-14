import IconButton from "@mui/material/IconButton";

export function SquareIconButton({
  icon,
  onClick,
  selected = false,
  sx = {},
  ...props
}) {
  return (
    <IconButton
      onClick={onClick}
      disableRipple
      size="small"
      sx={{
        color: selected
          ? "var(--icon-btn-color-active)"
          : "var(--icon-btn-color-default)",
        backgroundColor: selected
          ? "var(--icon-btn-bg-active)"
          : "var(--icon-btn-bg-default)",
        borderRadius: 1,
        "&:hover": {
          backgroundColor: selected
            ? "var(--icon-btn-bg-active-hover)"
            : "var(--icon-btn-bg-hover)",
          color: selected
            ? "var(--icon-btn-color-active-hover)"
            : "var(--icon-btn-color-hover)",
        },
        ...sx,
      }}
      {...props}
    >
      {icon}
    </IconButton>
  );
}
