import {
  ChatRounded,
  NotesRounded,
  RemoveRedEyeOutlined,
  DriveFileRenameOutline,
} from "@mui/icons-material";
import CardPopover from "./CardPopover";
import { Box } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { editCard, deleteCard } from "../store/actions/board-actions";

export function Card({
  card,
  listId,
  labels = [],
  onClickCard,
  labelsIsOpen,
  setLabelsIsOpen,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [title, setTitle] = useState(card.title);
  const { boardId } = useParams();

  function handleClickCard() {
    onClickCard(card);
    setAnchorEl(null);
  }

  function handleClick(e) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }

  function handleClickLabels(e) {
    e.stopPropagation();
    setLabelsIsOpen(prevIsOpen => !prevIsOpen);
  }

  function handleClose() {
    setAnchorEl(null);
    setTitle(card.title);
  }

  function handleSave() {
    card.title = title;
    handleClose();
    handleUpdateCard({ ...card, title });
  }

  function handleUpdateCard(card) {
    editCard(boardId, card, listId);
    handleClose();
  }

  function handleDelete() {
    deleteCard(boardId, card.id, listId);
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
          {labels.length > 0 && (
            <div className="card-labels">
              {labels.map(label => (
                <div
                  key={`${card.id}-${label.id}`}
                  className={`card-label ${label.color}`}
                >
                  <span className="card-label-text">{label.title}</span>
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
        <Box className="card-content" onClick={handleClickCard}>
          {labels.length > 0 && (
            <div className="card-labels" onClick={handleClickLabels}>
              {labels.map(label => (
                <div
                  key={`${card.id}-${label.id}`}
                  className={`card-label ${label.color} ${
                    labelsIsOpen ? "open" : "closed"
                  }`}
                >
                  <span className="card-label-text">{label.title}</span>
                </div>
              ))}
            </div>
          )}

          <h3 className={`card-title ${labels.length === 0 ? "mr-2" : ""}`}>
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
        cardId={card.id}
        listId={listId}
        openCard={handleClickCard}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleSave={handleSave}
      />
    </section>
  );
}
