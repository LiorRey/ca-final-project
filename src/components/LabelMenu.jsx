import { useState, useEffect } from "react";
import { Popover } from "./Popover";
import { LabelMenuItem } from "./LabelMenuItem";
import { LabelEditor } from "./LabelEditor";

export function LabelMenu({
  boardLabels,
  anchorEl,
  isLabelMenuOpen,
  onCloseLabelMenu,
  onSaveLabel,
  onRemoveLabel,
}) {
  const [view, setView] = useState("list"); // "list" or "editor"
  const [editingLabel, setEditingLabel] = useState(null);

  // Reset view to "list" when menu opens
  useEffect(() => {
    if (isLabelMenuOpen) {
      setView("list");
      setEditingLabel(null);
    }
  }, [isLabelMenuOpen]);

  function handleCreateLabel() {
    setEditingLabel(null); // null = create mode
    setView("editor");
  }

  function handleEditLabel(label) {
    setEditingLabel(label); // existing label = edit mode
    setView("editor");
  }

  function handleBack() {
    setView("list");
    setEditingLabel(null);
  }

  function handleCloseMenu() {
    onCloseLabelMenu();
  }

  function handleSaveLabel(labelData) {
    onSaveLabel(labelData);
    handleBack();
  }

  function handleRemoveLabel(labelId) {
    onRemoveLabel(labelId);
    handleBack();
  }

  return (
    <Popover
      className="label-menu-popover"
      anchorEl={anchorEl}
      isOpen={isLabelMenuOpen}
      onClose={handleCloseMenu}
      title={
        view === "list"
          ? "Labels"
          : editingLabel
          ? "Edit label"
          : "Create label"
      }
      showBack={view}
      onBack={handleBack}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
    >
      {view === "list" ? (
        <div className="label-menu-content">
          <input
            type="text"
            className="label-search"
            placeholder="Search labels..."
            autoFocus
          />

          <label className="label-menu-label">Labels</label>

          <ul className="labels-list">
            {boardLabels.map(label => (
              <li key={label.id}>
                <LabelMenuItem
                  label={label}
                  onEdit={() => handleEditLabel(label)}
                />
              </li>
            ))}
          </ul>

          <button className="create-label-btn" onClick={handleCreateLabel}>
            Create a new label
          </button>
        </div>
      ) : (
        <LabelEditor
          existingLabel={editingLabel}
          onSave={handleSaveLabel}
          onRemove={handleRemoveLabel}
        />
      )}
    </Popover>
  );
}
