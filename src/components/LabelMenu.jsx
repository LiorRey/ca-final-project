import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Popover } from "./Popover";
import { LabelMenuItem } from "./LabelMenuItem";
import { LabelEditor } from "./LabelEditor";
import { editCard, updateBoard } from "../store/actions/board-actions";

const VIEW_MENU = "menu";
const VIEW_EDITOR = "editor";

export function LabelMenu({
  boardId,
  listId,
  card,
  anchorEl,
  isLabelMenuOpen,
  onCloseLabelMenu,
}) {
  const [view, setView] = useState(VIEW_MENU);
  const [editingLabel, setEditingLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const boardLabels = useSelector(state => state.boards.board.labels);

  const filteredLabels = boardLabels.filter(label =>
    label.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isLabelMenuOpen) {
      setView(VIEW_MENU);
      setEditingLabel(null);
      setSearchTerm("");
    }
  }, [isLabelMenuOpen]);

  function getPopoverTitle() {
    if (view === VIEW_MENU) return "Labels";
    return editingLabel ? "Edit label" : "Create label";
  }

  function handleCreateLabel() {
    setEditingLabel(null);
    setView(VIEW_EDITOR);
  }

  function handleEditLabel(label) {
    setEditingLabel(label);
    setView(VIEW_EDITOR);
  }

  function handleBack() {
    setView(VIEW_MENU);
    setEditingLabel(null);
  }

  function handleCloseMenu() {
    onCloseLabelMenu();
  }

  async function handleSaveLabel(label) {
    try {
      const updatedBoardLabels = getUpdatedBoardLabels(label);
      const boardUpdates = { labels: updatedBoardLabels };
      await updateBoard(boardId, boardUpdates, {});

      if (!editingLabel) {
        toggleCardLabel(label.id);
      }

      handleBack();
    } catch (error) {
      console.error("Label save failed:", error);
    }
  }

  function getUpdatedBoardLabels(label) {
    const boardLabelIndex = boardLabels.findIndex(l => l.id === label.id);

    if (boardLabelIndex >= 0) {
      const updatedBoardLabels = [...boardLabels];
      updatedBoardLabels[boardLabelIndex] = label;

      return updatedBoardLabels;
    }

    return [...boardLabels, label];
  }

  function toggleCardLabel(labelId, shouldAddToCard = true) {
    const updatedLabelIds = shouldAddToCard
      ? [...card.labels, labelId]
      : card.labels.filter(id => id !== labelId);

    const updatedCard = { ...card, labels: updatedLabelIds };

    editCard(boardId, updatedCard, listId);
  }

  function handleToggleLabel(labelId) {
    try {
      const shouldAddToCard = !card.labels.includes(labelId);
      toggleCardLabel(labelId, shouldAddToCard);
    } catch (error) {
      console.error("Label check toggling failed:", error);
    }
  }

  async function handleDeleteLabel(labelId) {
    try {
      const updatedBoardLabels = boardLabels.filter(l => l.id !== labelId);
      const updates = { labels: updatedBoardLabels };
      await updateBoard(boardId, updates, {});

      if (card.labels.includes(labelId)) {
        const shouldAddToCard = false;
        toggleCardLabel(labelId, shouldAddToCard);
      }

      handleBack();
    } catch (error) {
      console.error("Label removal failed:", error);
    }
  }

  return (
    <Popover
      className="label-menu-popover"
      anchorEl={anchorEl}
      isOpen={isLabelMenuOpen}
      onClose={handleCloseMenu}
      title={getPopoverTitle()}
      showBack={view}
      onBack={view === VIEW_EDITOR ? handleBack : handleCloseMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
    >
      {view === VIEW_MENU ? (
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
                const isChecked = card.labels.some(
                  cardLabelId => cardLabelId === label.id
                );
                return (
                  <li key={label.id}>
                    <LabelMenuItem
                      label={label}
                      isChecked={isChecked}
                      onToggleLabel={handleToggleLabel}
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
          onDeleteLabel={handleDeleteLabel}
        />
      )}
    </Popover>
  );
}
