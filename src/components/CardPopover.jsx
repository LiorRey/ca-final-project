import React from "react";
import { Popover, Backdrop } from "@mui/material";
import { DeleteOutlineRounded, SaveSharp } from "@mui/icons-material";

export default function CardPopover({
  open,
  anchorEl,
  id,
  handleClose,
  handleDelete,
  handleSave,
}) {
  return (
    <Backdrop
      sx={{
        zIndex: theme => theme.zIndex.modal - 1,
      }}
      open={open}
      onClick={handleClose}
      className="card-container"
    >
      <Popover
        disableScrollLock
        className="card-popover"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          zIndex: theme => theme.zIndex.modal + 1,
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          },
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-popover-content">
          <button onClick={handleDelete} className="card-menu-button">
            <DeleteOutlineRounded /> Delete
          </button>
          <button onClick={handleSave} className="card-menu-button">
            <SaveSharp /> Save
          </button>
        </div>
      </Popover>
    </Backdrop>
  );
}
