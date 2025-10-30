import { useState, useEffect } from "react";
import { Popover } from "./Popover";
import { LabelMenuItem } from "./LabelMenuItem";
import { LabelEditor } from "./LabelEditor";

export function LabelMenu({
  boardLabels,
  cardLabels = [],
  anchorEl,
  isLabelMenuOpen,
  onCloseLabelMenu,
  onSaveLabel,
  onRemoveLabel,
  onToggleCardLabel,
}) {
  const [view, setView] = useState("list");
  const [editingLabel, setEditingLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLabels = boardLabels.filter(label =>
    label.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isLabelMenuOpen) {
      setView("list");
      setEditingLabel(null);
      setSearchTerm("");
    }
  }, [isLabelMenuOpen]);

  function handleCreateLabel() {
    setEditingLabel(null);
    setView("editor");
  }

  function handleEditLabel(label) {
    setEditingLabel(label);
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

    if (!editingLabel) {
      onToggleCardLabel(labelData.id);
    }

    handleBack();
  }

  function handleRemoveLabel(labelId) {
    onRemoveLabel(labelId);
    handleBack();
  }

  function handleToggleLabel(labelId) {
    onToggleCardLabel(labelId);
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
      onBack={view === "editor" ? handleBack : handleCloseMenu}
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
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />

          <label className="label-menu-label">Labels</label>

          <ul className="labels-list">
            {filteredLabels.length > 0 ? (
              filteredLabels.map(label => {
                const isChecked = cardLabels.some(
                  cardLabel => cardLabel.id === label.id
                );
                return (
                  <li key={label.id}>
                    <LabelMenuItem
                      label={label}
                      isChecked={isChecked}
                      onToggle={handleToggleLabel}
                      onEdit={() => handleEditLabel(label)}
                    />
                  </li>
                );
              })
            ) : (
              <li className="no-labels-found">No labels found</li>
            )}
          </ul>

          <button className="create-label-btn" onClick={handleCreateLabel}>
            Create a new label
          </button>
        </div>
      ) : (
        <LabelEditor
          existingLabel={editingLabel}
          onSaveLabel={handleSaveLabel}
          onRemoveLabel={handleRemoveLabel}
        />
      )}
    </Popover>
  );
}
