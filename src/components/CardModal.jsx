import React from "react";
import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function CardModal({ listTitle, card, onClose, open }) {
  if (!card) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="card-modal-box"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="card-modal-header">
          {listTitle}{" "}
          <button className="icon-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="card-modal-content">
          <h1 className="card-modal-title">{card.title}</h1>
          {card.labels.length > 0 && (
            <>
              <h3 className="labels-title">Labels</h3>
              <div className="modal-labels">
                {card.labels.map(label => (
                  <div className={`modal-label ${label.color}`} key={label.id}>
                    {label.name}
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
            >
              {card.description}
            </textarea>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
