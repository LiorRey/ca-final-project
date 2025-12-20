import ArrowBack from "@mui/icons-material/ArrowBack";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import PopoverMUI from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

export function Popover({
  anchorEl,
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  showBack = false,
  onBack,
  paperProps = {},
  slotProps = {},
  ...popoverProps
}) {
  return (
    <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseDown">
      <PopoverMUI
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        slotProps={{
          root: { sx: { pointerEvents: "none" } },
          backdrop: { sx: { pointerEvents: "none" } },
          paper: {
            className: "popover-paper",
            ...paperProps,
            sx: { pointerEvents: "auto", ...paperProps.sx },
          },
          ...slotProps,
        }}
        {...popoverProps}
      >
        <Box className="popover-header">
          {showBack && (
            <Box className="popover-header-back">
              <IconButton aria-label="Back" onClick={onBack}>
                <ArrowBack />
              </IconButton>
            </Box>
          )}
          <Typography className="popover-header-title">{title}</Typography>
          {showClose && (
            <Box className="popover-header-close">
              <IconButton aria-label="Close" onClick={onClose} size="small">
                <Close />
              </IconButton>
            </Box>
          )}
        </Box>
        {children}
      </PopoverMUI>
    </ClickAwayListener>
  );
}
