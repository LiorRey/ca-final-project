import { useState } from "react";
import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";

export function CardModal({
  listTitle,
  cardLabels = [],
  card,
  onClose,
  isOpen,
  onDeleteCard,
}) {
  const [openSection, setOpenSection] = useState(false);

  function handleCommentSection() {
    setOpenSection(!openSection);
  }

  if (!card) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={`card-modal-box ${openSection ? "open" : "closed"}`}>
        <div className="card-modal-header">
          {listTitle}{" "}
          <button className="icon-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="card-modal-container">
          <section className="card-modal-content">
            <h1 className="card-modal-title">{card.title}</h1>
            <div className="card-modal-controls">
              <button className="icon-button">
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
      </Box>
    </Modal>
  );
}
