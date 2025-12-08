import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiList from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import { Popover } from "../Popover";
import { BackgroundSelector } from "../BackgroundSelector";

import {
  PersonAdd,
  Info,
  Lock,
  Share,
  Palette,
  Star,
  Settings,
  Computer,
  Bolt,
  LocalOffer,
  StickyNote2,
  List,
  Delete,
  Visibility,
  ContentCopy,
  Email,
  ExitToApp,
} from "@mui/icons-material";

const MENU_ITEM_TYPES = {
  SEPARATOR: "separator",
};

function BoardMenuSeparator() {
  return (
    <Divider
      sx={{ opacity: 0.3, my: 1, borderColor: "var(--gray1)" }}
      className="board-menu-separator"
    />
  );
}

function BoardMenuItem({ item, onItemClick, currentBackground }) {
  return (
    <ListItem disablePadding className="board-menu-item">
      <ListItemButton onClick={() => onItemClick(item.id)}>
        <ListItemIcon className="board-menu-item-icon">
          {item.id === "background" ? (
            <div className={`board-bg-preview bg-${currentBackground}`} />
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText primary={item.label} />
        {item.badges && (
          <Box className="board-menu-badges-container">
            {item.badges.map((badge, badgeIndex) => (
              <Chip
                key={badgeIndex}
                label={badge.label}
                size="small"
                className="board-menu-badge"
                sx={{
                  backgroundColor: badge.color || "#3b3c3f",
                  color: "var(--gray1)",
                }}
              />
            ))}
          </Box>
        )}
        {item.secondaryIcon && (
          <Box className="board-menu-secondary-icon">{item.secondaryIcon}</Box>
        )}
      </ListItemButton>
    </ListItem>
  );
}

function createMenuItems() {
  return [
    {
      id: "share",
      label: "Share",
      icon: <PersonAdd />,
      badges: [
        { label: "VG", color: "#1565c0" },
        { label: "L", color: "#c62828" },
        { label: "SS", color: "#e65100" },
      ],
    },
    { type: MENU_ITEM_TYPES.SEPARATOR },
    { id: "about", label: "About this board", icon: <Info /> },
    { id: "visibility", label: "Visibility: Private", icon: <Lock /> },
    { id: "print", label: "Print, export, and share", icon: <Share /> },
    { id: "star", label: "Star", icon: <Star /> },
    { type: MENU_ITEM_TYPES.SEPARATOR },
    { id: "settings", label: "Settings", icon: <Settings /> },
    { id: "background", label: "Change background", icon: <Palette /> },
    { id: "upgrade", label: "Upgrade", icon: <Computer /> },
    { type: MENU_ITEM_TYPES.SEPARATOR },
    { id: "automation", label: "Automation", icon: <Bolt /> },
    { id: "labels", label: "Labels", icon: <LocalOffer /> },
    { id: "stickers", label: "Stickers", icon: <StickyNote2 /> },
    { id: "activity", label: "Activity", icon: <List /> },
    { id: "archived", label: "Archived items", icon: <Delete /> },
    { type: MENU_ITEM_TYPES.SEPARATOR },
    { id: "watch", label: "Watch", icon: <Visibility /> },
    { id: "copy", label: "Copy board", icon: <ContentCopy /> },
    { id: "email", label: "Email-to-board", icon: <Email /> },
    { id: "leave", label: "Leave board", icon: <ExitToApp /> },
  ];
}

export function BoardMenu({ anchorEl, isBoardMenuOpen, onCloseBoardMenu }) {
  const [menuItemId, setMenuItemId] = useState("");
  const menuItems = useMemo(() => createMenuItems(), []);
  const currentBackground =
    useSelector(state => state.boards.board?.appearance?.background) || "blue";
  const isMainMenu = menuItemId === "";

  function handleCloseBoardMenu() {
    setMenuItemId("");
    onCloseBoardMenu();
  }

  function renderContent() {
    if (menuItemId === "background") {
      return <BackgroundSelector currentBackground={currentBackground} />;
    }

    return (
      <MuiList className="board-menu-list">
        {menuItems.map((item, index) =>
          item.type === MENU_ITEM_TYPES.SEPARATOR ? (
            <BoardMenuSeparator key={`sep-${index}`} />
          ) : (
            <BoardMenuItem
              key={item.id}
              item={item}
              onItemClick={() => setMenuItemId(item.id)}
              currentBackground={currentBackground}
            />
          )
        )}
      </MuiList>
    );
  }

  const activeItem = menuItems.find(item => item.id === menuItemId);

  return (
    <Popover
      anchorEl={anchorEl}
      transitionDuration={0}
      isOpen={isBoardMenuOpen}
      onClose={onCloseBoardMenu}
      title={isMainMenu ? "Menu" : activeItem.label}
      showBack={!isMainMenu}
      onBack={() => setMenuItemId("")}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      paperProps={{ sx: { mt: 1 } }}
      slotProps={{ transition: { onExited: () => handleCloseBoardMenu() } }}
    >
      {renderContent()}
    </Popover>
  );
}
