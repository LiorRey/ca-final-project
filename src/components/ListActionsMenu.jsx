import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { Popover } from "./Popover";
import "../assets/styles/components/ListActionsMenu.css";

function listActionsMenuItems() {
  return [
    { label: "Add Card", action: () => {} },
    { label: "Copy List", action: () => {} },
    { label: "Move List", action: () => {} },
    { label: "Move All cards in this list", action: () => {} },
    { label: "Sort list...", action: () => {} },
    { label: "Watch", action: () => {} },
    { label: "Archive this list", action: () => {} },
    { label: "Archive all cards in this list", action: () => {} },
  ];
}

export function ListActionsMenu({ anchorEl, isOpen, onClose }) {
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
    >
      <MenuList className="list-actions-menu" dense>
        {listActionsMenuItems().map(({ label, action }) => (
          <MenuItem key={label} onClick={action}>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  );
}
