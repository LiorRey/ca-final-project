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
  Check,
} from "@mui/icons-material";
import { useState } from "react";
import { PopoverMenuProvider } from "./card/PopoverMenuProvider";
import { CardActionForm } from "./card/CardActionForm";
import { moveCard, copyCard } from "../store/actions/board-actions";
import { useParams } from "react-router-dom";

export default function CardPopover({
  card,
  listId,
  open,
  anchorEl,
  id,
  openCard,
  handleClose,
  handleDelete,
}) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { boardId } = useParams();

  function handleOpen() {
    openCard();
  }

  function handleEditLabels() {
    console.log("editLabels");
  }

  function handleArchive() {
    console.log("archive");
    handleDelete();
  }

  function handleCopyCardClick(e) {
    setPopoverAnchorEl(e.currentTarget);
    setActiveMenuItem("copyCard");
  }

  function handleMoveCardClick(e) {
    setPopoverAnchorEl(e.currentTarget);
    setActiveMenuItem("moveCard");
  }

  function handleCopyLinkClick(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/board/${boardId}/${listId}/${card.id}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleCopyCardSubmit(formData) {
    const {
      boardId: destinationBoardId,
      keepLabels,
      keepMembers,
      listId: destinationListId,
      position,
      title,
    } = formData;

    const copyData = {
      sourceBoardId: boardId,
      destinationBoardId,
      sourceListId: listId,
      destinationListId,
      keepLabels,
      keepMembers,
      position,
      title,
    };

    copyCard(copyData, card);
    handlePopoverClose();
    handleClose();
  }

  function handleMoveCardSubmit(formData) {
    const {
      boardId: destinationBoardId,
      listId: destinationListId,
      position,
    } = formData;

    const moveData = {
      sourceBoardId: boardId,
      sourceListId: listId,
      destinationBoardId,
      destinationListId,
      position,
    };

    moveCard(moveData, card);
    handlePopoverClose();
    handleClose();
  }

  function handleMenuClick(e, key) {
    e.stopPropagation();
    const menuHandlers = {
      open: handleOpen,
      editLabels: handleEditLabels,
      copyCard: handleCopyCardClick,
      copyLink: handleCopyLinkClick,
      moveCard: handleMoveCardClick,
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
              {key === "copyLink" && copiedLink ? (
                <Check sx={{ color: "#22c55e" }} />
              ) : (
                icon
              )}
              {label}
            </button>
          ))}
        </div>
      </Popover>
      {popoverOpen && (
        <PopoverMenuProvider
          anchorEl={popoverAnchorEl}
          isOpen={popoverOpen}
          onClose={handlePopoverClose}
          activeMenuItem={activeMenuItem}
          card={card}
          menuTitle={
            activeMenuItem === "copyCard" ? "Copy to..." : "Move to..."
          }
          submitButtonText={
            activeMenuItem === "copyCard" ? "Create card" : "Move"
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          paperProps={{ sx: { mt: 1 } }}
          sx={{
            zIndex: theme => theme.zIndex.modal + 2,
          }}
        >
          <CardActionForm
            card={card}
            isCopyMode={activeMenuItem === "copyCard"}
            onCopySubmit={handleCopyCardSubmit}
            onMoveSubmit={handleMoveCardSubmit}
          />
        </PopoverMenuProvider>
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
