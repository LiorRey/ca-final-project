import React from "react";
import { Popover, Backdrop } from "@mui/material";
import {
  PermIdentity,
  East,
  ContentCopyOutlined,
  TurnedInNotOutlined,
  LinkOutlined,
  ArchiveOutlined,
  OpenInNew,
} from "@mui/icons-material";
import { useState } from "react";

import { Popover as MenuPopover } from "./Popover";

export default function CardPopover({
  open,
  anchorEl,
  id,
  openCard,
  handleClose,
  handleDelete,
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  function handleMenuClick(e, key) {
    e.stopPropagation();
    switch (key) {
      case "open":
        handleOpen();
        break;
      case "editLabels":
        handleEditLabels();
        break;
      case "changeMembers":
        handleChangeMembers();
        break;
      case "moveCard":
        handleMoveCard();
        break;
      case "copyCard":
        handleCopyCard(e);
        break;
      case "copyLink":
        handleCopyLink(e);
        break;
      case "archive":
        handleArchive();
        break;
      default:
        break;
    }
  }
  function handleOpen() {
    openCard();
    console.log("open");
  }
  function handleEditLabels() {
    console.log("editLabels");
  }
  function handleArchive() {
    console.log("delete");
    handleDelete();
  }

  function handleCopyCard(e) {
    setPopoverAnchorEl(e.currentTarget);
    setPopoverOpen(true);
    setActiveMenuItem("copyCard");
  }

  return (
    <Backdrop
      sx={{
        zIndex: theme => theme.zIndex.modal - 1,
      }}
      open={open}
      onClick={handleClose}
      className="card-container"
    >
      <Popover
        disableScrollLock
        disableEnforceFocus
        disableAutoFocus
        className="card-popover"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          zIndex: theme => theme.zIndex.modal + 1,
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          },
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-popover-content">
          {listActionstems().map(({ label, key, icon }) => (
            <button
              key={key}
              onClick={e => handleMenuClick(e, key)}
              className={`card-menu-button ${
                activeMenuItem === key ? "is-active" : ""
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </Popover>
      <MenuPopover
        title="Copy card"
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={() => {
          setPopoverOpen(false);
          setActiveMenuItem(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ zIndex: theme => theme.zIndex.modal + 2 }}
      />
    </Backdrop>
  );
}

function listActionstems() {
  return [
    { label: "Open card", key: "open", icon: <OpenInNew /> },
    {
      label: "Edit labels",
      key: "editLabels",
      icon: <TurnedInNotOutlined />,
    },
    {
      label: "Change members",
      key: "changeMembers",
      icon: <PermIdentity />,
    },
    { label: "Move card", key: "moveCard", icon: <East /> },
    { label: "Copy card", key: "copyCard", icon: <ContentCopyOutlined /> },
    { label: "Copy link", key: "copyLink", icon: <LinkOutlined /> },
    { label: "Archive", key: "archive", icon: <ArchiveOutlined /> },
  ];
}
