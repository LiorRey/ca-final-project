import { useState } from "react";
import { boardService } from "../services/board";

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

export function LabelEditor({
  existingLabel = null,
  onSaveLabel,
  onDeleteLabel,
}) {
  const [title, setTitle] = useState(existingLabel?.title || "");
  const [selectedColor, setSelectedColor] = useState(
    existingLabel?.color || colors[0]
  );

  const isEditMode = existingLabel !== null;

  function handleSave() {
    const baseLabel = isEditMode ? existingLabel : boardService.getEmptyLabel();

    const label = {
      ...baseLabel,
      title,
      color: selectedColor,
    };

    onSaveLabel(label);
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
        <button className="save-btn" onClick={handleSave}>
          {isEditMode ? "Save" : "Create"}
        </button>
        {isEditMode && (
          <button
            className="delete-btn"
            onClick={() => onDeleteLabel(existingLabel?.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
