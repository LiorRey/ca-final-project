import { useMemo } from "react";
import { useNavigate } from "react-router";

import { Avatar } from "./ui/Avatar";
import { PopoverMenu } from "./ui/PopoverMenu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiList from "@mui/material/List";
import { ExitToApp } from "@mui/icons-material";
import { logout } from "../store/actions/auth-actions";

function UserMenuItem({ item, onItemClick }) {
  return (
    <ListItem disablePadding className="user-menu-item">
      <ListItemButton onClick={onItemClick}>
        <ListItemIcon className="user-menu-item-icon">{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    </ListItem>
  );
}

function createUserMenuItems() {
  return [{ id: "logout", label: "Log out", icon: <ExitToApp /> }];
}

export function UserMenu({ user, anchorEl, isOpen, onClose }) {
  const navigate = useNavigate();
  const menuItems = useMemo(() => createUserMenuItems(), []);

  async function handleLogout() {
    try {
      await logout();
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Cannot logout: " + err.message);
    }
  }

  function handleMenuItemClick(itemId) {
    if (itemId === "logout") {
      handleLogout();
    }
  }

  if (!user) return null;

  return (
    <PopoverMenu
      anchorEl={anchorEl}
      isOpen={isOpen}
      onClose={onClose}
      title="ACCOUNT"
      showClose={false}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      paperProps={{ sx: { mt: 1, minWidth: 240 } }}
    >
      <div className="user-menu-content">
        <div className="user-menu-info">
          <Avatar user={user} size={40} />
          <div className="user-menu-details">
            <div className="user-menu-name">{user.fullname}</div>
            <div className="user-menu-email">{user.email}</div>
          </div>
        </div>
      </div>
      <MuiList className="user-menu-list">
        {menuItems.map(item => (
          <UserMenuItem
            key={item.id}
            item={item}
            onItemClick={() => handleMenuItemClick(item.id)}
          />
        ))}
      </MuiList>
    </PopoverMenu>
  );
}
