import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { Popover } from "./Popover";
import CopyListForm from "./CopyListForm";
import "../assets/styles/components/ListActionsMenu.css";

export function ListActionsMenu({
  list,
  anchorEl,
  isOpen,
  onClose,
  onCopyList,
}) {
  const [activeAction, setActiveAction] = useState(null);

  function handleMenuClick(key) {
    if (key === "copy") {
      setActiveAction("copy");
    }
  }

  function handleCopyList(newName) {
    if (onCopyList && newName) {
      onCopyList(newName);
    }
    setActiveAction(null);
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
          list={list}
          initialValue={list.name}
          onCopy={handleCopyList}
          onCancel={handleCopyCancel}
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
