import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { boardService } from "../services/board";

export function AddList({ onAddList }) {
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");

  function handleAddList() {
    if (!newListName) {
      handleHideAddList();
      return;
    }

    const newList = boardService.getEmptyList();
    newList.name = newListName;
    onAddList(newList);

    setNewListName("");
  }

  function handleHideAddList() {
    setNewListName("");
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
              value={newListName}
              placeholder="Enter list name"
              onChange={e => setNewListName(e.target.value)}
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
