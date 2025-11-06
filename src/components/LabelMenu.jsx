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

  function handleShowCreateLabel() {
    setLabelToEdit(null);
    setViewEditor(true);
  }

  function handleShowEditLabel(label) {
    setLabelToEdit(label);
    setViewEditor(true);
  }

  function handleBack() {
    setLabelToEdit(null);
    setViewEditor(false);
  }

  function onCreateLabel(label) {
    createLabel(boardId, label);
    onToggleLabel(label.id);
    handleBack();
  }

  function onEditLabel(label) {
    editLabel(boardId, label);
    handleBack();
  }

  function onDeleteLabel(labelId) {
    deleteLabel(boardId, labelId);

    if (card.labels.includes(labelId)) {
      onToggleLabel(labelId);
    }

    handleBack();
  }

  function onToggleLabel(labelId) {
    const updatedCardLabels = card.labels.includes(labelId)
      ? card.labels.filter(id => id !== labelId)
      : [...card.labels, labelId];

    updateCardLabels(boardId, listId, card.id, updatedCardLabels);
  }

  function getPopoverTitle() {
    if (!viewEditor) return "Labels";
    return labelToEdit ? "Edit label" : "Create label";
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
    >
      {viewEditor ? (
        <LabelEditor
          labelToEdit={labelToEdit}
          onSaveLabel={labelToEdit ? onEditLabel : onCreateLabel}
          onDeleteLabel={onDeleteLabel}
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
                      onToggleLabel={onToggleLabel}
                      onShowEditLabel={handleShowEditLabel}
                    />
                  </li>
                );
              })
            ) : (
              <li className="no-labels-found">No labels found</li>
            )}
          </ul>

          <button className="create-label-btn" onClick={handleShowCreateLabel}>
            Create a new label
          </button>
        </div>
      )}
    </Popover>
  );
}
