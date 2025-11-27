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
        <Button
          startIcon={<AddIcon />}
          className="add-list-button"
          onClick={() => setShowAddList(true)}
        >
          Add another list
        </Button>
      ) : (
        <div className="add-list-container">
          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={newListTitle}
              placeholder="Enter list name"
              onChange={e => setNewListTitle(e.target.value)}
              autoFocus
            />
          </div>
          <Button onClick={handleAddList} onMouseDown={e => e.preventDefault()}>
            Add List
          </Button>
          <IconButton aria-label="close" onClick={handleHideAddList}>
            <CloseIcon />
          </IconButton>
        </div>
      )}
    </>
  );
}
