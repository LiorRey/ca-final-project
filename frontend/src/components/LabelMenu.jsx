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
    const createdLabel = await createLabel(card.boardId, label);
    if (createdLabel && createdLabel._id) {
      handleToggleLabel(createdLabel._id);
    }
    setSearchTerm("");
    handleBack();
  }

  function handleEditLabel(label) {
    editLabel(card.boardId, label);
    handleBack();
  }

  async function handleDeleteLabel(labelId) {
    await deleteLabel(card.boardId, labelId);
    handleBack();
  }

  function handleToggleLabel(labelId) {
    let updatedCardLabels;
    if (card.labelIds) {
      updatedCardLabels = card.labelIds?.includes(labelId)
        ? card.labelIds.filter(id => id !== labelId)
        : [...card.labelIds, labelId];
    } else {
      updatedCardLabels = [];
    }

    updateCardLabels(card.boardId, card.listId, card._id, updatedCardLabels);
  }

  function getPopoverTitle() {
    if (!viewEditor) return "Labels";
    return labelToEdit._id ? "Edit label" : "Create label";
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
          onSaveLabel={labelToEdit._id ? handleEditLabel : handleCreateLabel}
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
                const isChecked = card.labelIds
                  ? card.labelIds.some(cardLabelId => cardLabelId === label._id)
                  : false;
                return (
                  <li key={label._id}>
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
