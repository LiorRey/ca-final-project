import { useEffect, useRef, useState } from "react";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { boardService } from "../services/board";

export function AddList({ onAddList, onScrollToEnd }) {
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const textFieldRef = useRef(null);

  function handleShowAddList() {
    setShowAddList(true);
    onScrollToEnd();
  }

  function handleAddList() {
    if (!newListName) {
      handleCloseAddListActions();
      return;
    }

    const newList = boardService.getEmptyList();
    newList.name = newListName;
    onAddList(newList);

    setNewListName("");
    textFieldRef.current?.focus();
  }

  const handleCloseAddListActions = () => {
    setNewListName("");
    setShowAddList(false);
  };

  useEffect(() => {
    if (showAddList) {
      textFieldRef.current?.focus();
    }
  }, [showAddList]);

  return (
    <>
      {!showAddList ? (
        <Button
          startIcon={<AddIcon />}
          className="add-list-button"
          onClick={handleShowAddList}
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
              inputRef={textFieldRef}
            />
          </div>
          <Button onClick={handleAddList}>Add List</Button>
          <IconButton aria-label="close" onClick={handleCloseAddListActions}>
            <CloseIcon />
          </IconButton>
        </div>
      )}
    </>
  );
}
