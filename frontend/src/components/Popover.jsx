import ArrowBack from "@mui/icons-material/ArrowBack";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import PopoverMUI from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { SquareIconButton } from "./ui/buttons/SquareIconButton";

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
        {showBack && (
          <Box className="popover-header-back">
            <SquareIconButton
              icon={<ArrowBack />}
              aria-label="Back"
              onClick={onBack}
            />
          </Box>
        )}
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
