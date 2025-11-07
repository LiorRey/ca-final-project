import PopoverMUI from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SquareIconButton } from "./ui/buttons/SquareIconButton";
import Close from "@mui/icons-material/Close";

export function Popover({
  anchorEl,
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  paperProps = {},
  slotProps = {},
  ...popoverProps
}) {
  return (
    <PopoverMUI
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        paper: {
          className: "popover-paper",
          ...paperProps,
        },
        ...slotProps,
      }}
      {...popoverProps}
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
