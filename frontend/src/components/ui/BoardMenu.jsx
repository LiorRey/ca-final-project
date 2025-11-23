import { useMemo } from "react";
import PopoverMUI from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MuiList from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import { SquareIconButton } from "./buttons/SquareIconButton";
import {
  Close,
  PersonAdd,
  Info,
  Lock,
  Share,
  Star,
  Settings,
  Palette,
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

function BoardMenuItem({ item, onItemClick }) {
  return (
    <ListItem disablePadding className="board-menu-item">
      <ListItemButton
        onClick={e => {
          if (onItemClick && item.id) {
            onItemClick(item.id, e);
          }
        }}
        disabled={item.disabled}
        className="board-menu-item-button"
      >
        {item.icon && (
          <ListItemIcon className="board-menu-item-icon">
            {item.icon}
          </ListItemIcon>
        )}
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
    {
      id: "about",
      label: "About this board",
      icon: <Info />,
    },
    {
      id: "visibility",
      label: "Visibility: Private",
      icon: <Lock />,
    },
    {
      id: "print",
      label: "Print, export, and share",
      icon: <Share />,
    },
    {
      id: "star",
      label: "Star",
      icon: <Star />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings />,
    },
    {
      id: "background",
      label: "Change background",
      icon: <Palette />,
    },
    {
      id: "upgrade",
      label: "Upgrade",
      icon: <Computer />,
    },
    { type: MENU_ITEM_TYPES.SEPARATOR },
    {
      id: "automation",
      label: "Automation",
      icon: <Bolt />,
    },
    {
      id: "labels",
      label: "Labels",
      icon: <LocalOffer />,
    },
    {
      id: "stickers",
      label: "Stickers",
      icon: <StickyNote2 />,
    },
    {
      id: "activity",
      label: "Activity",
      icon: <List />,
    },
    {
      id: "archived",
      label: "Archived items",
      icon: <Delete />,
    },
    { type: MENU_ITEM_TYPES.SEPARATOR },
    {
      id: "watch",
      label: "Watch",
      icon: <Visibility />,
    },
    {
      id: "copy",
      label: "Copy board",
      icon: <ContentCopy />,
    },
    {
      id: "email",
      label: "Email-to-board",
      icon: <Email />,
    },
    {
      id: "leave",
      label: "Leave board",
      icon: <ExitToApp />,
    },
  ];
}

export function BoardMenu({
  anchorEl,
  open,
  onClose,
  onItemClick,
  anchorOrigin = {
    vertical: "top",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "left",
  },
  ...popoverProps
}) {
  function handleItemClick(itemId, e) {
    if (onItemClick) {
      onItemClick(itemId, e);
    } else {
      console.log(`${itemId} clicked`);
    }
    onClose();
  }

  const menuItems = useMemo(() => createMenuItems(), []);

  const renderMenuItem = (item, index) => {
    if (item.type === MENU_ITEM_TYPES.SEPARATOR) {
      return <BoardMenuSeparator key={`separator-${index}`} />;
    }

    const key = item.id || `item-${index}`;
    return (
      <BoardMenuItem key={key} item={item} onItemClick={handleItemClick} />
    );
  };

  return (
    <PopoverMUI
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      transitionDuration={0}
      slotProps={{
        paper: {
          className: "board-menu-paper",
          sx: { padding: 1 },
        },
      }}
      {...popoverProps}
    >
      <Box className="board-menu-header">
        <Typography className="board-menu-header-title">Menu</Typography>
        <Box className="board-menu-header-close">
          <SquareIconButton
            icon={<Close />}
            aria-label="Close"
            onClick={onClose}
          />
        </Box>
      </Box>

      <MuiList className="board-menu-list">
        {menuItems.map(renderMenuItem)}
      </MuiList>
    </PopoverMUI>
  );
}
