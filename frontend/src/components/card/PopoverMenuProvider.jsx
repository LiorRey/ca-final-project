import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import PopoverMUI from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import { SquareIconButton } from "../ui/buttons/SquareIconButton";
import { useFormState } from "../../hooks/useFormState";
import { PopoverMenuContext } from "./PopoverMenuContext";

export function PopoverMenuProvider({
  children,
  activeMenuItem,
  card = null,
  isOpen,
  anchorEl,
  onClose,
  menuTitle,
  submitButtonText,
  showClose = true,
  anchorOrigin,
  transformOrigin,
  paperProps,
  sx,
}) {
  const [openSelectMenuId, setOpenSelectMenuId] = useState(null);

  const boards = useSelector(state => state.boards.boards);
  const board = useSelector(state => state.boards.board);
  const cardTitle = card?.title || "";

  let initialValues = {};

  switch (activeMenuItem) {
    case "copyCard":
      initialValues = {
        title: cardTitle,
        boardId: board?._id || "",
        listId: board?.lists?.[0]?.id || "",
        position: 0,
        keepLabels: true,
        keepMembers: true,
      };
      break;
    case "moveCard":
      initialValues = {
        boardId: board?._id || "",
        listId: board?.lists?.[0]?.id || "",
        position: 0,
      };
      break;
  }

  const { values, handleChange, setValues } = useFormState(initialValues);

  const selectedBoardLists = useMemo(
    () => boards.find(b => b._id === values.boardId)?.lists || [],
    [boards, values.boardId]
  );

  const selectedList = useMemo(
    () => selectedBoardLists.find(l => l.id === values.listId) || null,
    [selectedBoardLists, values.listId]
  );

  const suggestedList = useMemo(
    () => selectedBoardLists.find(l => l.id === values.listId) || null,
    [selectedBoardLists, values.listId]
  );

  const maxPosition = useMemo(
    () => (selectedList?.cards?.length ? selectedList.cards.length + 1 : 1),
    [selectedList]
  );

  const cardLabels = card?.labels || [];
  const cardLabelsCount = Array.isArray(cardLabels) ? cardLabels.length : 0;
  const cardMembers = card?.assignedTo || [];
  const cardMembersCount = Array.isArray(cardMembers) ? cardMembers.length : 0;

  function handleBoardChange(e) {
    const newBoardId = e.target.value;
    const newBoard = boards.find(b => b._id === newBoardId);
    const newBoardLists = newBoard?.lists || [];
    const firstListId = newBoardLists[0]?.id || "";

    setValues(prev => ({
      ...prev,
      boardId: newBoardId,
      listId: firstListId,
      position: 0,
    }));
  }

  function handleSuggestedClick() {
    if (suggestedList) {
      setValues(prev => ({
        ...prev,
        listId: suggestedList.id,
      }));
    }
  }

  function handleListChange(e) {
    setValues(prev => ({
      ...prev,
      listId: e.target.value,
      position: 0,
    }));
  }

  function handlePositionChange(e) {
    setValues(prev => ({
      ...prev,
      position: e.target.value,
    }));
  }

  function handleSelectOpen(selectId) {
    setOpenSelectMenuId(prev => (prev === selectId ? null : selectId));
  }

  function handleSelectClose() {
    setOpenSelectMenuId(null);
  }

  function handleClickAway(e) {
    e.stopPropagation();
    handleSelectClose();
  }

  function handlePopoverClose(event, reason) {
    if (event) {
      event.stopPropagation();
    }
    onClose(event, reason);
  }

  const contextValue = {
    values,
    handleChange,
    setValues,

    boards,

    selectedBoardLists,
    suggestedList,
    maxPosition,

    cardLabelsCount,
    cardMembersCount,

    openSelectMenuId,

    handleBoardChange,
    handleSuggestedClick,
    handleListChange,
    handlePositionChange,
    handleSelectOpen,
    handleSelectClose,

    submitButtonText,

    handlePopoverClose,
    menuTitle,
  };

  return (
    <PopoverMenuContext.Provider value={contextValue}>
      <PopoverMUI
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handlePopoverClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        disableEnforceFocus
        disableAutoFocus
        slotProps={{
          paper: {
            className: "popover-paper",
            ...paperProps,
            onClick: e => {
              e.stopPropagation();
              handleClickAway(e);
            },
          },
        }}
        sx={sx}
      >
        <Box className="popover-header">
          <Typography className="popover-header-title">{menuTitle}</Typography>
          {showClose && (
            <Box className="popover-header-close">
              <SquareIconButton
                icon={<Close />}
                aria-label="Close"
                onClick={onClose}
              />
            </Box>
          )}
        </Box>
        {children}
      </PopoverMUI>
    </PopoverMenuContext.Provider>
  );
}
