import PopoverMUI from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export function PopoverMenu({
  children,
  isOpen,
  anchorEl,
  onClose,
  title,
  showClose = true,
  showHeader = true,
  anchorOrigin,
  transformOrigin,
  paperProps,
  sx,
}) {
  function handlePopoverClose(event, reason) {
    if (event) {
      event.stopPropagation();
    }
    onClose(event, reason);
  }

  return (
    <PopoverMUI
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handlePopoverClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      disableEnforceFocus
      disableRestoreFocus
      slotProps={{
        paper: {
          className: "popover-paper",
          ...paperProps,
          onClick: e => e.stopPropagation(),
        },
        backdrop: {
          onMouseUp: handlePopoverClose,
        },
      }}
      sx={sx}
    >
      {showHeader && (
        <Box className="popover-header-container">
          <Typography className="popover-header-title-text">{title}</Typography>
          {showClose && (
            <Box>
              <IconButton
                className="popover-header-close-button"
                aria-label="Close"
                onClick={onClose}
              >
                <Close />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
      {children}
    </PopoverMUI>
  );
}
