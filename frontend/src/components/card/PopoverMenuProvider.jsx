import PopoverMUI from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import { useState } from "react";
import { SquareIconButton } from "../ui/buttons/SquareIconButton";
import { PopoverMenuContext } from "./PopoverMenuContext";

export function PopoverMenuProvider({
  children,
  isOpen,
  anchorEl,
  onClose,
  menuTitle,
  submitButtonText,
  showClose = true,
  anchorOrigin,
  transformOrigin,
  paperProps,
  sx,
}) {
  const [openSelectMenuId, setOpenSelectMenuId] = useState(null);

  function handleSelectOpen(selectId) {
    setOpenSelectMenuId(prev => (prev === selectId ? null : selectId));
  }

  function handleSelectClose() {
    setOpenSelectMenuId(null);
  }

  function handlePopoverClose(event, reason) {
    if (event) {
      event.stopPropagation();
    }
    onClose(event, reason);
  }

  function handleClickAway(e) {
    e.stopPropagation();
    handleSelectClose();
  }

  const contextValue = {
    submitButtonText,
    openSelectMenuId,
    handleSelectOpen,
    handleSelectClose,
    handlePopoverClose,
    menuTitle,
  };

  return (
    <PopoverMenuContext.Provider value={contextValue}>
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
            onClick: e => {
              e.stopPropagation();
              handleClickAway(e);
            },
          },
        }}
        sx={sx}
      >
        <Box className="popover-header">
          <Typography className="popover-header-title">{menuTitle}</Typography>
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
    </PopoverMenuContext.Provider>
  );
}
