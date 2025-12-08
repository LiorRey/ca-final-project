import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { boardService } from "../services/board";

export function AddList({ onAddList }) {
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  function handleAddList() {
    if (!newListTitle) {
      handleHideAddList();
      return;
    }

    const newList = boardService.getEmptyList();
    newList.title = newListTitle;
    onAddList(newList);

    setNewListTitle("");
  }

  function handleHideAddList() {
    setNewListTitle("");
    setShowAddList(false);
  }

  return (
    <>
      {!showAddList ? (
        <button
          className="add-list-button"
          onClick={() => setShowAddList(true)}
        >
          <AddIcon /> Add another list
        </button>
      ) : (
        <div className="add-list-container">
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="small"
            value={newListTitle}
            placeholder="Enter list name..."
            onChange={e => setNewListTitle(e.target.value)}
            autoFocus
            className="add-list-input"
          />
          <div className="add-list-actions">
            <Button
              onClick={handleAddList}
              onMouseDown={e => e.preventDefault()}
              className="add-submit-button"
            >
              Add list
            </Button>
            <IconButton
              sx={{
                margin: "0.5rem 0 0 0",
              }}
              size="small"
              aria-label="close"
              onClick={handleHideAddList}
              className="add-close-button"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
}
