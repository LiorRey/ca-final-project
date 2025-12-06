import { useState } from "react";
import { useSelector } from "react-redux";

import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

import { Popover } from "./Popover";
import "../assets/styles/components/ListActionsMenu.css";
import { CopyListForm } from "./CopyListForm";
import { MoveListForm } from "./MoveListForm";
import {
  moveList,
  loadBoards,
  archiveList,
  archiveAllCardsInList,
} from "../store/actions/board-actions";

export function ListActionsMenu({
  list,
  anchorEl,
  isOpen,
  onClose,
  onAddCardAtTop,
  onCopyList,
  onMoveAllCards,
}) {
  const [activeAction, setActiveAction] = useState(null);
  const boards = useSelector(state => state.boards.boards);
  const currentBoard = useSelector(state => state.boards.board);
  const activeListIndex = useSelector(state => state.ui.lists.activeListIndex);

  function handleMenuClick(key) {
    if (!listActionsMenuItems().find(item => item.key === key)) return;

    if (key === "add") {
      onAddCardAtTop();
      setActiveAction(null);
      onClose();
    } else if (key === "archiveList") {
      archiveList(currentBoard._id, list._id);
      onClose();
    } else if (key === "archiveAllCards") {
      archiveAllCardsInList(currentBoard._id, list._id);
      onClose();
    } else {
      setActiveAction(key);
    }
  }

  function handleMoveAllCards(destinationListId) {
    onMoveAllCards(list._id, destinationListId);
    onClose();
  }

  function handleCopyList(listId, newName) {
    onCopyList(listId, newName);
    setActiveAction(null);
    onClose();
  }

  async function handleMoveList({ targetBoardId, targetPosition }) {
    await moveList(list.id, targetBoardId, targetPosition);

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
    onClose();
  }

  return (
    <Popover
      className="list-actions-menu-popover"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      title="List actions"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
      slotProps={{ transition: { onExited: () => setActiveAction(null) } }}
    >
      {activeAction === "copy" ? (
        <CopyListForm
          initialValue={list.title}
          onCopy={newName => handleCopyList(list._id, newName)}
          onCancel={handleCopyCancel}
        />
      ) : activeAction === "moveAll" ? (
        <MenuList className="popover-menu" dense>
          {currentBoard.lists.map(listItem => (
            <MenuItem
              key={listItem._id}
              disabled={listItem._id === list._id}
              onClick={() => handleMoveAllCards(listItem._id)}
            >
              <ListItemText>{listItem.title}</ListItemText>
            </MenuItem>
          ))}
          <MenuItem onClick={() => handleMoveAllCards("new")}>
            <ListItemText>New List</ListItemText>
          </MenuItem>
        </MenuList>
      ) : activeAction === "move" ? (
        <MoveListForm
          currentBoard={currentBoard}
          boards={boards}
          activeListIndex={activeListIndex}
          onCancel={onPopoverClose}
          onSubmit={handleMoveList}
        />
      ) : (
        <MenuList className="list-actions-menu popover-menu" dense>
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
    { label: "Archive this list", key: "archiveList" },
    { label: "Archive all cards in this list", key: "archiveAllCards" },
  ];
}
