import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Popover } from "./Popover";
import { LabelMenuItem } from "./LabelMenuItem";
import { LabelEditor } from "./LabelEditor";
import { addNewLabelToCard, updateBoard } from "../store/actions/board-actions";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus-service";

export function LabelMenu({
  cardLabels = [],
  anchorEl,
  isLabelMenuOpen,
  onCloseLabelMenu,
  onToggleCardLabel,
  listId,
  card,
}) {
  const [view, setView] = useState("list");
  const [editingLabel, setEditingLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const board = useSelector(state => state.boards.board);

  const filteredLabels = board.labels?.filter(label =>
    label.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isLabelMenuOpen) {
      setView("list");
      setEditingLabel(null);
      setSearchTerm("");
    }
  }, [isLabelMenuOpen]);

  function getPopoverTitle() {
    if (view === "list") return "Labels";
    return editingLabel ? "Edit label" : "Create label";
  }

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
    try {
      const labelDataId = labelData?.id;

      const updatedBoardLabels = getUpdatedBoardLabels(labelData);
      const boardUpdates = { labels: updatedBoardLabels };
      const boardOptions = { listId: null, cardId: null };

      if (!editingLabel) {
        const updatedCard = getUpdatedCard(labelDataId);
        addNewLabelToCard(
          board._id,
          boardUpdates,
          boardOptions,
          updatedCard,
          listId
        );
      } else {
        updateBoard(board._id, boardUpdates, boardOptions);
      }

      const successMsgText = `Label "${labelData.title}" saved successfully!`;
      showSuccessMsg(successMsgText);
      handleBack();
    } catch (error) {
      console.error("Label save failed:", error);
      showErrorMsg(`Unable to save label: ${labelData.title}`);
    }
  }

  function getUpdatedBoardLabels(labelData) {
    const boardLabels = board.labels || [];
    const boardLabelIndex = boardLabels.findIndex(l => l.id === labelData.id);
    let updatedBoardLabels;

    if (boardLabelIndex >= 0) {
      updatedBoardLabels = [...boardLabels];
      updatedBoardLabels[boardLabelIndex] = labelData;
    } else {
      updatedBoardLabels = [...boardLabels, labelData];
    }

    return updatedBoardLabels;
  }

  function getUpdatedCard(labelDataId) {
    const cardLabelIds = card.labels || [];
    let updatedLabelIds;

    if (cardLabelIds.includes(labelDataId)) {
      updatedLabelIds = cardLabelIds.filter(id => id !== labelDataId);
    } else {
      updatedLabelIds = [...cardLabelIds, labelDataId];
    }

    return { ...card, labels: updatedLabelIds };
  }

  function handleDeleteLabel(labelId) {
    try {
      const boardLabels = board.labels || [];
      const updatedBoardLabels = boardLabels.filter(l => l.id !== labelId);
      const updates = { labels: updatedBoardLabels };
      const options = { listId: null, cardId: null };

      updateBoard(board._id, updates, options);
      showSuccessMsg("Label removed successfully!");
      handleBack();
    } catch (error) {
      console.error("Label removal failed:", error);
      showErrorMsg("Unable to remove label");
    }
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
      title={getPopoverTitle()}
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
          onDeleteLabel={handleDeleteLabel}
        />
      )}
    </Popover>
  );
}
