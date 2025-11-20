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
  sx,
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

  const menuItems = [
    {
      id: "share",
      label: "Share",
      icon: <PersonAdd />,
      badges: [
        { label: "VG", color: "#1565c0" },
        { label: "L", color: "#c62828" },
        { label: "SS", color: "#e65100" },
      ],
      onClick: e => handleItemClick("share", e),
    },
    { type: "separator" },
    {
      id: "about",
      label: "About this board",
      icon: <Info />,
      onClick: e => handleItemClick("about", e),
    },
    {
      id: "visibility",
      label: "Visibility: Private",
      icon: <Lock />,
      onClick: e => handleItemClick("visibility", e),
    },
    {
      id: "print",
      label: "Print, export, and share",
      icon: <Share />,
      onClick: e => handleItemClick("print", e),
    },
    {
      id: "star",
      label: "Star",
      icon: <Star />,
      onClick: e => handleItemClick("star", e),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings />,
      onClick: e => handleItemClick("settings", e),
    },
    {
      id: "background",
      label: "Change background",
      icon: <Palette />,
      onClick: e => handleItemClick("background", e),
    },
    {
      id: "upgrade",
      label: "Upgrade",
      icon: <Computer />,
      onClick: e => handleItemClick("upgrade", e),
    },
    {
      type: "section",
      title: "Upgrade to add Custom Fields",
      description: "Add dropdowns, text fields, dates, and more to your cards.",
      action: {
        label: "Start free trial",
        onClick: e => handleItemClick("start-free-trial", e),
      },
      icon: <Computer className="board-menu-section-upgrade-icon" />,
      sx: {
        backgroundColor: "rgba(156, 39, 176, 0.1)",
      },
    },
    { type: "separator" },
    {
      id: "automation",
      label: "Automation",
      icon: <Bolt />,
      onClick: e => handleItemClick("automation", e),
    },
    {
      id: "labels",
      label: "Labels",
      icon: <LocalOffer />,
      onClick: e => handleItemClick("labels", e),
    },
    {
      id: "stickers",
      label: "Stickers",
      icon: <StickyNote2 />,
      onClick: e => handleItemClick("stickers", e),
    },
    {
      id: "activity",
      label: "Activity",
      icon: <List />,
      onClick: e => handleItemClick("activity", e),
    },
    {
      id: "archived",
      label: "Archived items",
      icon: <Delete />,
      onClick: e => handleItemClick("archived", e),
    },
    { type: "separator" },
    {
      id: "watch",
      label: "Watch",
      icon: <Visibility />,
      onClick: e => handleItemClick("watch", e),
    },
    {
      id: "copy",
      label: "Copy board",
      icon: <ContentCopy />,
      onClick: e => handleItemClick("copy", e),
    },
    {
      id: "email",
      label: "Email-to-board",
      icon: <Email />,
      onClick: e => handleItemClick("email", e),
    },
    {
      id: "leave",
      label: "Leave board",
      icon: <ExitToApp />,
      onClick: e => handleItemClick("leave", e),
    },
  ];

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
          sx: { padding: 2, ...sx },
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
        {menuItems.map((item, index) => {
          if (item.type === "separator") {
            return (
              <Divider
                key={`separator-${index}`}
                sx={{ opacity: 0.3, my: 1, borderColor: "var(--gray1)" }}
                className="board-menu-separator"
              />
            );
          }

          if (item.type === "section") {
            return (
              <Box
                key={`section-${index}`}
                className="board-menu-section"
                sx={item.sx}
              >
                {item.title && (
                  <Typography className="board-menu-section-title">
                    {item.title}
                  </Typography>
                )}
                {item.description && (
                  <Typography className="board-menu-section-description">
                    {item.description}
                  </Typography>
                )}
                {item.action && (
                  <Typography
                    component="a"
                    href={item.action.href}
                    onClick={item.action.onClick}
                    className="board-menu-section-action"
                  >
                    {item.action.label}
                  </Typography>
                )}
                {item.icon && (
                  <Box className="board-menu-section-icon">{item.icon}</Box>
                )}
              </Box>
            );
          }

          return (
            <ListItem
              key={item.id || index}
              disablePadding
              className="board-menu-item"
            >
              <ListItemButton
                onClick={e => {
                  if (item.onClick) {
                    item.onClick(e, item);
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
                  <Box className="board-menu-secondary-icon">
                    {item.secondaryIcon}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </MuiList>
    </PopoverMUI>
  );
}
