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

import CopyCardForm from "./CopyCardForm";
import { Popover as MenuPopover } from "./Popover";

export default function CardPopover({
  card,
  open,
  anchorEl,
  id,
  openCard,
  handleClose,
  handleDelete,
}) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  function handleOpen(e) {
    openCard();
    console.log("open");
  }
  function handleEditLabels(e) {
    console.log("editLabels");
  }
  function handleArchive(e) {
    console.log("delete");
    handleDelete();
  }

  function handleCopyCard(e) {
    setPopoverAnchorEl(e.currentTarget);
    setActiveMenuItem("copyCard");
  }

  function handleMenuClick(e, key) {
    e.stopPropagation();
    const menuHandlers = {
      open: handleOpen,
      editLabels: handleEditLabels,
      copyCard: handleCopyCard,
      archive: handleArchive,
    };
    menuHandlers[key]?.(e);
  }

  function handlePopoverClose() {
    setPopoverAnchorEl(null);
    setActiveMenuItem(null);
  }

  const popoverOpen = Boolean(popoverAnchorEl);

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
          {cardActionsMenuItems().map(({ label, key, icon }) => (
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
      {popoverOpen && (
        <MenuPopover
          className="copy-card-form-popover"
          anchorEl={popoverAnchorEl}
          isOpen={popoverOpen}
          onClose={handlePopoverClose}
          title="Copy card"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          paperProps={{ sx: { mt: 1 } }}
          sx={{
            zIndex: theme => theme.zIndex.modal + 2,
          }}
          onClick={e => e.stopPropagation()}
        >
          <CopyCardForm
            card={card}
            onSubmit={handleCopyCard}
            onCancel={handlePopoverClose}
          />
        </MenuPopover>
      )}
    </Backdrop>
  );
}

function cardActionsMenuItems() {
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
