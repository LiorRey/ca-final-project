import { useState } from "react";

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

export function LabelEditor({ existingLabel = null, onSave, onRemove }) {
  const isEditMode = existingLabel !== null;

  const [title, setTitle] = useState(existingLabel?.title || "");
  const [selectedColor, setSelectedColor] = useState(
    existingLabel?.color || colors[0]
  );

  function handleSave() {
    const labelData = {
      id: existingLabel?.id || Date.now().toString(),
      title,
      color: selectedColor,
    };
    onSave(labelData);
  }

  function handleRemove() {
    if (existingLabel) {
      onRemove(existingLabel.id);
    }
  }

  return (
    <div className="label-editor-content">
      {/* Color Preview */}
      <div className={`label-preview label-color-option ${selectedColor}`}>
        {title}
      </div>

      {/* Title Input */}
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

      {/* Color Selection */}
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

      {/* Remove Color Option (optional) */}
      <button className="remove-color-btn">✕ Remove color</button>

      {/* Action Buttons */}
      <div className="label-editor-actions">
        <button className="save-btn" onClick={handleSave}>
          {isEditMode ? "Save" : "Create"}
        </button>
        {isEditMode && (
          <button className="delete-btn" onClick={handleRemove}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
