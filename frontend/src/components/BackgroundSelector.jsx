import { useMemo } from "react";
import Box from "@mui/material/Box";
import { Button, Popover } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Close } from "@mui/icons-material";
import { SquareIconButton } from "./ui/buttons/SquareIconButton";

function getCSSVariable(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

export function BackgroundSelector({
  anchorEl,
  open,
  onClose,
  currentBackground,
  onSelectBackground,
}) {
  const DEFAULT_BACKGROUNDS = useMemo(
    () => [
      { id: "blue", color: getCSSVariable("--bg-blue") },
      { id: "orange", color: getCSSVariable("--bg-orange") },
      { id: "green", color: getCSSVariable("--bg-green") },
      { id: "red", color: getCSSVariable("--bg-red") },
      { id: "purple", color: getCSSVariable("--bg-purple") },
      { id: "pink", color: getCSSVariable("--bg-pink") },
      { id: "emerald", color: getCSSVariable("--bg-emerald") },
      { id: "turquoise", color: getCSSVariable("--bg-turquoise") },
      { id: "gray", color: getCSSVariable("--bg-gray") },
    ],
    []
  );

  function handleSelect(backgroundId) {
    onSelectBackground(backgroundId);
    onClose();
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transitionDuration={0}
      slotProps={{
        paper: {
          className: "background-selector-paper",
          sx: { padding: 2, minWidth: 300 },
        },
      }}
    >
      <Box className="background-selector-header">
        <Typography className="background-selector-title">
          Change background
        </Typography>
        <Box className="background-selector-close">
          <SquareIconButton
            icon={<Close />}
            aria-label="Close"
            onClick={onClose}
          />
        </Box>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Colors
      </Typography>

      <Grid container spacing={1}>
        {DEFAULT_BACKGROUNDS.map(({ id, color }) => (
          <Grid item xs={3} key={id}>
            <Button
              onClick={() => handleSelect(color)}
              sx={{
                height: 64,
                backgroundColor: color,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: currentBackground === color ? "2px solid #000" : "none",
              }}
            >
              {currentBackground === color && (
                <Typography variant="caption" sx={{ color: "white" }}>
                  ✓
                </Typography>
              )}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Popover>
  );
}
