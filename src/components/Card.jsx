import {
  ChatRounded,
  NotesRounded,
  RemoveRedEyeOutlined,
  DriveFileRenameOutline,
  SaveSharp,
} from "@mui/icons-material";

import CardPopover from "./CardPopover";

import { Box } from "@mui/material";
import { useState } from "react";

export function Card({ card, onRemoveCard, onUpdateCard }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [title, setTitle] = useState(card.title);

  function handleClick(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
    setTitle(card.title);
  }

  function handleSave() {
    card.title = title;
    handleClose();
  }

  function handleDelete() {
    onRemoveCard(card.id);
    handleClose();
  }

  const open = Boolean(anchorEl);
  const id = open ? `card-popover` : undefined;

  return (
    <section className="card-container">
      {open ? (
        <Box
          className="floating-card-content"
          sx={{ zIndex: theme => theme.zIndex.modal + 2 }}
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
          <textarea
            className="card-title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="card-footer">
            <div className="empty-card-footer" />
          </div>
          <button className="icon-button card-edit-button" />
          <button onClick={handleSave} className="icon-button card-save-button">
            Save
          </button>
        </Box>
      ) : (
        <Box className="card-content">
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

          <h3
            className={`card-title ${card.labels.length === 0 ? "mr-2" : ""}`}
          >
            {card.title}
          </h3>

          <div className="card-footer">
            <RemoveRedEyeOutlined />
            <ChatRounded />
            <NotesRounded />
          </div>
          <button
            onClick={handleClick}
            aria-describedby={id}
            aria-label="Edit card"
            className="icon-button card-edit-button"
          >
            <DriveFileRenameOutline />
          </button>
        </Box>
      )}
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
