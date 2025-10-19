import {
  ChatRounded,
  NotesRounded,
  RemoveRedEyeOutlined,
  DriveFileRenameOutline,
} from "@mui/icons-material";

import CardPopover from "./CardPopover";

import { Box } from "@mui/material";
import { useState } from "react";

export function Card({ card, onRemoveCard, onUpdateCard }) {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleSave() {}

  function handleDelete() {
    onRemoveCard(card.id);
    handleClose();
  }

  const open = Boolean(anchorEl);
  const id = open ? `card-popover` : undefined;

  return (
    <section className="card-container">
      <Box
        className={`${open ? "floating-card-content" : "card-content"}`}
        sx={open ? { zIndex: theme => theme.zIndex.modal + 1 } : {}}
      >
        {card.labels.length > 0 && (
          <div className="card-labels">
            {card.labels.map(label => (
              <div
                key={`${card.id}-${label.name}`}
                className={`card-label ${label.color}`}
              >
                {label.name}
              </div>
            ))}
          </div>
        )}
        <h3 className={`card-title ${card.labels.length === 0 ? "mr-2" : ""}`}>
          {card.title}
        </h3>
        {open ? (
          <div className="card-footer">
            <div className="empty-card-footer" />
          </div>
        ) : (
          <div className="card-footer">
            <RemoveRedEyeOutlined />
            <ChatRounded />
            <NotesRounded />
          </div>
        )}
        <button
          onClick={handleClick}
          aria-describedby={id}
          aria-label="Edit card"
          className="icon-button card-edit-button"
        >
          <DriveFileRenameOutline />
        </button>
      </Box>

      {/* We could send the card object to the popover to edit the card which would be more efficient */}
      <CardPopover
        open={open}
        anchorEl={anchorEl}
        id={id}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleSave={handleSave}
      />
    </section>
  );
}
