import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ChatRounded,
  DriveFileRenameOutline,
  NotesRounded,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { AvatarGroup } from "./ui/AvatarGroup";
import Button from "@mui/material/Button";
import { Draggable } from "@hello-pangea/dnd";
import { CardPopover } from "./CardPopover";
import { deleteCard, editCard } from "../store/actions/board-actions";
import { Avatar } from "./ui/Avatar";

export function Card({
  card,
  listId,
  index,
  labels = [],
  onClickCard,
  labelsIsOpen,
  setLabelsIsOpen,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [title, setTitle] = useState(card.title);
  const { boardId } = useParams();
  const members = useSelector(state => state.boards.board.members);

  function getCardMembers(card) {
    return card && card.assignedTo && card.assignedTo.length > 0 && members
      ? card.assignedTo
          .map(assignee => members.find(member => member._id === assignee))
          .filter(Boolean)
      : [];
  }

  const cardMembers = getCardMembers(card);

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
  }

  function handleSave() {
    handleUpdateCard({ ...card, title });
  }

  function handleUpdateCard(card) {
    editCard(boardId, card, listId);
    handleClose();
  }

  function handleDelete() {
    deleteCard(boardId, card._id, listId);
    handleClose();
  }

  const open = Boolean(anchorEl);
  const id = open ? `card-popover` : undefined;

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card-container ${
            snapshot.isDragging ? "card-container--dragging" : ""
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {open ? (
            <Box
              className="floating-card-content"
              sx={{ zIndex: theme => theme.zIndex.modal + 2 }}
            >
              {labels.length > 0 && (
                <div className="card-labels">
                  {labels.map(label => (
                    <div
                      key={`${card._id}-${label._id}`}
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
                <div className="card-footer-left">
                  <RemoveRedEyeOutlined />
                  <ChatRounded />
                  <NotesRounded />
                </div>
                <div className="card-footer-right">
                  {cardMembers.length > 0 && (
                    <AvatarGroup max={4}>
                      {cardMembers.map(member => (
                        <Avatar key={member._id} user={member} />
                      ))}
                    </AvatarGroup>
                  )}
                </div>
              </div>
              <button className="card-edit-button" disabled />
              <Button
                onClick={handleSave}
                onMouseDown={e => e.preventDefault()}
                className="add-submit-button"
              >
                Save
              </Button>
            </Box>
          ) : (
            <Box className="card-content" onClick={handleClickCard}>
              {labels.length > 0 && (
                <div className="card-labels" onClick={handleClickLabels}>
                  {labels.map(label => (
                    <div
                      key={`${card._id}-${label._id}`}
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
                <div className="card-footer-left">
                  <RemoveRedEyeOutlined />
                  <ChatRounded />
                  <NotesRounded />
                </div>
                <div className="card-footer-right">
                  {cardMembers.length > 0 && (
                    <AvatarGroup max={4}>
                      {cardMembers.map(member => (
                        <Avatar key={member._id} user={member} />
                      ))}
                    </AvatarGroup>
                  )}
                </div>
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
            card={card}
            id={id}
            cardId={card._id}
            listId={listId}
            openCard={handleClickCard}
            handleClose={handleClose}
            handleDelete={handleDelete}
            handleSave={handleSave}
          />
        </div>
      )}
    </Draggable>
  );
}
