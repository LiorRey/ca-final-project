import { useState } from "react";
import { boardService } from "../services/board";
import Button from "@mui/material/Button";

const colors = [
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "blue",
  "sky",
  "lime",
  "pink",
  "gray",
];

export function LabelEditor({ labelToEdit, onSaveLabel, onDeleteLabel }) {
  const [title, setTitle] = useState(labelToEdit.title);
  const [selectedColor, setSelectedColor] = useState(
    labelToEdit.color || colors[0]
  );

  function handleSave() {
    const label = labelToEdit._id ? labelToEdit : boardService.getEmptyLabel();

    const updatedLabel = {
      ...label,
      title,
      color: selectedColor,
    };

    onSaveLabel(updatedLabel);
  }

  return (
    <div className="label-editor-content">
      <div className={`label-preview label-color-option ${selectedColor}`}>
        {title}
      </div>

      <div className="label-editor-field">
        <label className="label-editor-label">Title</label>
        <input
          type="text"
          className="label-editor-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter label title"
          autoFocus
        />
      </div>

      <div className="label-editor-field">
        <label className="label-editor-label">Select a color</label>
        <div className="color-grid">
          {colors.map(color => (
            <button
              key={color}
              className={`label-color-option ${color} ${
                selectedColor === color ? "selected" : ""
              }`}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="label-editor-actions">
        <Button className="save-btn" onClick={handleSave}>
          {labelToEdit._id ? "Save" : "Create"}
        </Button>
        {labelToEdit._id && (
          <button
            className="delete-btn"
            onClick={() => onDeleteLabel(labelToEdit._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
