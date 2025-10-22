import { useState, useRef, useEffect } from "react";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FilterList from "@mui/icons-material/FilterList";
import { useCardFilters } from "../hooks/useCardFilters";

export function FilterMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [localTitle, setLocalTitle] = useState("");
  const anchorRef = useRef(null);
  const { filters, updateFilterDebounced, clearAllFilters } = useCardFilters();

  useEffect(() => {
    setLocalTitle(filters.title || "");
  }, [filters.title]);

  const handleClearFilters = () => {
    setLocalTitle("");
    clearAllFilters();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTitleChange = event => {
    const value = event.target.value;
    setLocalTitle(value);
    updateFilterDebounced("title", value);
  };

  const hasActiveFilters = () => {
    return filters.title && filters.title.trim() !== "";
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleOpen}>
        <FilterList />
      </IconButton>

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: { width: 320, p: 2 },
          },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Filter
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Title
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter card title..."
              value={localTitle}
              onChange={handleTitleChange}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters()}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleClose}
              sx={{ ml: "auto" }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
