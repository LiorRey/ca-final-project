import { useState } from "react";
import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";
import { LabelMenu } from "./LabelMenu";

export function CardModal({
  listTitle,
  cardLabels = [],
  card,
  boardLabels = [],
  onClose,
  isOpen,
  onDeleteCard,
  onEditCard,
  onSaveLabel,
  onRemoveLabel,
  onUpdateCard,
}) {
  const [openSection, setOpenSection] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cardDetails, setCardDetails] = useState(card);
  const [anchorEl, setAnchorEl] = useState(null);
  const isLabelMenuOpen = Boolean(anchorEl);

  function onOpenLabelMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function onCloseLabelMenu() {
    setAnchorEl(null);
  }

  function handleEditCard() {
    setIsEditing(true);
  }
  function handleCommentSection() {
    setOpenSection(!openSection);
  }

  function handleSaveCard() {
    onEditCard(cardDetails);
    setIsEditing(false);
  }

  function handleChangeCard(key, value) {
    setCardDetails({ ...cardDetails, [key]: value });
  }

  function handleToggleCardLabel(labelId) {
    const currentLabelIds = card.labels || [];
    let updatedLabelIds;

    if (currentLabelIds.includes(labelId)) {
      updatedLabelIds = currentLabelIds.filter(id => id !== labelId);
    } else {
      updatedLabelIds = [...currentLabelIds, labelId];
    }

    const updatedCard = {
      ...card,
      labels: updatedLabelIds,
    };

    onUpdateCard(updatedCard);
  }

  if (!card) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={`card-modal-box ${openSection ? "open" : "closed"}`}>
        <div className="card-modal-header">
          {listTitle}
          <button className="icon-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="card-modal-container">
          <section className="card-modal-content">
            {isEditing ? (
              <input
                type="text"
                value={cardDetails.title}
                onChange={e => handleChangeCard("title", e.target.value)}
                onBlur={handleSaveCard}
              />
            ) : (
              <h1 className="card-modal-title" onClick={handleEditCard}>
                {cardDetails.title}
              </h1>
            )}
            <div className="card-modal-controls">
              <button
                className="icon-button"
                onClick={onOpenLabelMenu}
                selected={isLabelMenuOpen}
              >
                <AddIcon /> Add label
              </button>
              <button className="icon-button" onClick={onDeleteCard}>
                <DeleteIcon /> Delete
              </button>
              <button className="icon-button">
                <AttachFileIcon /> Attach
              </button>
            </div>
            {cardLabels && cardLabels.length > 0 && (
              <>
                <h3 className="labels-title">Labels</h3>
                <div className="modal-labels">
                  {cardLabels.map(label => (
                    <div
                      className={`modal-label ${label.color}`}
                      key={label.id}
                    >
                      {label.title}
                    </div>
                  ))}
                  <button className="add-label-button">+</button>
                </div>
              </>
            )}
            <div className="card-modal-description">
              <h3 className="description-title">Description</h3>
              <textarea
                className="description-input"
                placeholder="Add a description"
                spellCheck="false"
                value={card.description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </section>
          <aside
            className={`card-modal-comments ${openSection ? "open" : "closed"}`}
          >
            <div className="card-modal-comments-content">
              <h3 className="comments-title">Comments</h3>
              <textarea
                className="comment-input"
                placeholder="Add a comment"
                spellCheck="false"
              />
              <button className="add-comment-button">Add</button>
            </div>
          </aside>
        </div>
        <footer className="card-modal-footer">
          <button
            className="comment-section-button"
            onClick={handleCommentSection}
          >
            Comments
          </button>
        </footer>

        <LabelMenu
          boardLabels={boardLabels}
          cardLabels={cardLabels}
          anchorEl={anchorEl}
          isLabelMenuOpen={isLabelMenuOpen}
          onCloseLabelMenu={onCloseLabelMenu}
          onSaveLabel={onSaveLabel}
          onRemoveLabel={onRemoveLabel}
          onToggleCardLabel={handleToggleCardLabel}
        />
      </Box>
    </Modal>
  );
}
