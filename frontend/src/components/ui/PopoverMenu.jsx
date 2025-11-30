import PopoverMUI from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import { SquareIconButton } from "./buttons/SquareIconButton";

export function PopoverMenu({
  children,
  isOpen,
  anchorEl,
  onClose,
  title,
  showClose = true,
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
      <Box className="popover-header">
        <Typography className="popover-header-title">{title}</Typography>
        {showClose && (
          <Box className="popover-header-close">
            <SquareIconButton
              icon={<Close />}
              aria-label="Close"
              onClick={onClose}
            />
          </Box>
        )}
      </Box>
      {children}
    </PopoverMUI>
  );
}
