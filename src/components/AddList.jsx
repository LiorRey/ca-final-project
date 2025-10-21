import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { boardService } from "../services/board";

export function AddList({ onSubmit, scrollHorizontallyBoardCanvasToEnd }) {
  const [showAddList, setShowAddList] = useState(true);
  const [listName, setListName] = useState("");

  function onSubmitAddList() {
    if (!listName) return;
    const newList = boardService.getEmptyList();
    newList.name = listName;
    onSubmit(newList);
    setListName("");
    setShowAddList(true);
  }

  return (
    <>
      {showAddList && (
        <Button
          startIcon={<AddIcon />}
          className="add-list-button"
          onClick={() => setShowAddList(false)}
        >
          Add another list
        </Button>
      )}
      {!showAddList && (
        <div className="add-list-container">
          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={listName}
              placeholder="Enter list name"
              onChange={e => setListName(e.target.value)}
            />
          </div>
          <Button onClick={onSubmitAddList}>Add List</Button>
          <IconButton
            aria-label="close"
            onClick={() => {
              setShowAddList(true);
              setListName("");
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
      {!showAddList && scrollHorizontallyBoardCanvasToEnd()}
    </>
  );
}
