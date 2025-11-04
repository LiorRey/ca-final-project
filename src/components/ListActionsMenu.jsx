import { useState } from "react";
import { useSelector } from "react-redux";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

import { Popover } from "./Popover";
import { CopyListForm } from "./CopyListForm";
import { MoveListForm } from "./MoveListForm";
import { moveList, loadBoards } from "../store/actions/board-actions";

export function ListActionsMenu({
  list,
  anchorEl,
  isOpen,
  onClose,
  onCopyList,
}) {
  const [activeAction, setActiveAction] = useState(null);
  const boards = useSelector(state => state.boards.boards);
  const currentBoard = useSelector(state => state.boards.board);
  const activeListIndex = useSelector(state => state.ui.lists.activeListIndex);

  function handleMenuClick(key) {
    if (!listActionsMenuItems().find(item => item.key === key)) return;
    setActiveAction(key);
  }

  function handleCopyList(listId, newName) {
    onCopyList(listId, newName);
    setActiveAction(null);
    onClose();
  }

  async function handleMoveList({ targetBoardId, targetPosition }) {
    await moveList(
      currentBoard._id,
      activeListIndex,
      targetPosition,
      targetBoardId,
      currentBoard._id
    );

    if (targetBoardId !== currentBoard._id) {
      loadBoards();
    }

    setActiveAction(null);
    onClose();
  }

  function handleCopyCancel() {
    setActiveAction(null);
  }

  function onPopoverClose() {
    setActiveAction(null);
    onClose();
  }

  return (
    <Popover
      className="list-actions-menu-popover"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onPopoverClose}
      title="List actions"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
    >
      {activeAction === "copy" ? (
        <CopyListForm
          initialValue={list.name}
          onCopy={newName => handleCopyList(list.id, newName)}
          onCancel={handleCopyCancel}
        />
      ) : activeAction === "move" ? (
        <MoveListForm
          currentBoard={currentBoard}
          boards={boards}
          activeListIndex={activeListIndex}
          onCancel={onPopoverClose}
          onSubmit={handleMoveList}
        />
      ) : (
        <MenuList className="list-actions-menu" dense>
          {listActionsMenuItems().map(({ label, key }) => (
            <MenuItem key={key} onClick={() => handleMenuClick(key)}>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      )}
    </Popover>
  );
}

function listActionsMenuItems() {
  return [
    { label: "Add Card", key: "add" },
    { label: "Copy List", key: "copy" },
    { label: "Move List", key: "move" },
    { label: "Move All cards in this list", key: "moveAll" },
    { label: "Sort list...", key: "sort" },
    { label: "Watch", key: "watch" },
    { label: "Archive this list", key: "archive" },
    { label: "Archive all cards in this list", key: "archiveAll" },
  ];
}
