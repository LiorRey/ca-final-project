import { useState } from "react";
import { useSelector } from "react-redux";
import { Popover } from "./Popover";
import { LabelMenuItem } from "./LabelMenuItem";
import { LabelEditor } from "./LabelEditor";
import {
  createLabel,
  editLabel,
  deleteLabel,
  updateCardLabels,
} from "../store/actions/board-actions";

export function LabelMenu({
  boardId,
  listId,
  card,
  anchorEl,
  isLabelMenuOpen,
  onCloseLabelMenu,
}) {
  const [viewEditor, setViewEditor] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const boardLabels = useSelector(state => state.boards.board.labels);
  const filteredLabels = boardLabels.filter(label =>
    label.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleShowEditor(label) {
    setLabelToEdit(label);
    setViewEditor(true);
  }

  function handleBack() {
    setLabelToEdit(null);
    setViewEditor(false);
  }

  function handleCloseLabelMenu() {
    setSearchTerm("");
    setLabelToEdit(null);
    setViewEditor(false);
    onCloseLabelMenu();
  }

  async function handleCreateLabel(label) {
    await createLabel(boardId, label);
    handleToggleLabel(label.id);
    setSearchTerm("");
    handleBack();
  }

  function handleEditLabel(label) {
    editLabel(boardId, label);
    handleBack();
  }

  async function handleDeleteLabel(labelId) {
    await deleteLabel(boardId, labelId);
    handleBack();
  }

  function handleToggleLabel(labelId) {
    const updatedCardLabels = card.labels.includes(labelId)
      ? card.labels.filter(id => id !== labelId)
      : [...card.labels, labelId];

    updateCardLabels(boardId, listId, card.id, updatedCardLabels);
  }

  function getPopoverTitle() {
    if (!viewEditor) return "Labels";
    return labelToEdit.id ? "Edit label" : "Create label";
  }

  return (
    <Popover
      className="label-menu-popover"
      anchorEl={anchorEl}
      isOpen={isLabelMenuOpen}
      onClose={onCloseLabelMenu}
      title={getPopoverTitle()}
      showBack={true}
      onBack={viewEditor ? handleBack : onCloseLabelMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
      slotProps={{ transition: { onExited: () => handleCloseLabelMenu() } }}
    >
      {viewEditor ? (
        <LabelEditor
          labelToEdit={labelToEdit}
          onSaveLabel={labelToEdit.id ? handleEditLabel : handleCreateLabel}
          onDeleteLabel={handleDeleteLabel}
        />
      ) : (
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
                      onShowEditor={handleShowEditor}
                    />
                  </li>
                );
              })
            ) : (
              <li className="no-labels-found">No labels found</li>
            )}
          </ul>

          <button
            className="create-label-btn"
            onClick={() => handleShowEditor({ title: searchTerm })}
          >
            Create a new label
          </button>
        </div>
      )}
    </Popover>
  );
}
