import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import PopoverMUI from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import East from "@mui/icons-material/East";
import Close from "@mui/icons-material/Close";
import ActionButton from "./ActionButton";
import { SquareIconButton } from "./SquareIconButton";
import CustomSelect from "../../CustomSelect";
import { useFormState } from "../../../hooks/useFormState";

const SELECT_IDS = {
  BOARD: "card-board-select",
  LIST: "card-list-select",
  POSITION: "card-position-select",
};

export function PopoverMenu({
  anchorEl,
  isOpen,
  onClose,
  activeMenuItem,
  card = null,
  onSubmit,
  title,
  anchorOrigin,
  transformOrigin,
  paperProps,
  sx,
  showClose = true,
}) {
  const [openSelectMenuId, setOpenSelectMenuId] = useState(null);

  const boards = useSelector(state => state.boards.boards);
  const board = useSelector(state => state.boards.board);

  const cardTitle = card?.title || "";
  const isCopyMode = activeMenuItem === "copyCard";

  // Initialize form values based on mode
  const initialValues = isCopyMode
    ? {
        title: cardTitle,
        boardId: board?._id || "",
        listId: board?.lists?.[0]?.id || "",
        position: 0,
        keepLabels: true,
        keepMembers: true,
      }
    : {
        boardId: board?._id || "",
        listId: board?.lists?.[0]?.id || "",
        position: 0,
      };

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

  function handleSubmit(e) {
    e.preventDefault();

    if (isCopyMode) {
      const newTitle = values.title.trim();
      if (!newTitle) return;

      onSubmit({
        title: newTitle,
        boardId: values.boardId,
        listId: values.listId,
        position: parseInt(values.position),
        keepLabels: values.keepLabels,
        keepMembers: values.keepMembers,
      });
    } else {
      onSubmit({
        boardId: values.boardId,
        listId: values.listId,
        position: parseInt(values.position),
      });
    }
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

  const displayTitle = title || (isCopyMode ? "Copy to..." : "Move to...");
  const submitButtonText = isCopyMode ? "Create card" : "Move";

  return (
    <PopoverMUI
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handlePopoverClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
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
        <Typography className="popover-header-title">{displayTitle}</Typography>
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
      <Box>
        <form onSubmit={handleSubmit} className="card-form-menu">
          {/* Copy mode: Title input */}
          {isCopyMode && (
            <Box className="card-form-section">
              <Typography className="card-form-section-label">Title</Typography>
              <TextareaAutosize
                id="card-textfield"
                name="title"
                value={values.title}
                onChange={handleChange}
                minRows={2}
                autoFocus
                className="card-form-textarea"
              />
            </Box>
          )}

          {/* Copy mode: Keep labels and members checkboxes */}
          {isCopyMode && (
            <Box className="card-form-section">
              <Typography className="card-form-section-label">
                Keep...
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="keepLabels"
                      checked={values.keepLabels}
                      onChange={handleChange}
                      classes={{
                        root: "card-form-checkbox",
                      }}
                    />
                  }
                  label={`Labels (${cardLabelsCount})`}
                  className="card-form-checkbox-label"
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="keepMembers"
                      checked={values.keepMembers}
                      onChange={handleChange}
                      classes={{
                        root: "card-form-checkbox",
                      }}
                    />
                  }
                  label={`Members (${cardMembersCount})`}
                  className="card-form-checkbox-label"
                />
              </Box>
            </Box>
          )}

          {/* Move mode: Suggested list section */}
          {!isCopyMode && suggestedList && (
            <Box className="card-form-suggested-section">
              <Box className="card-form-suggested-header">
                <AutoAwesome className="card-form-suggested-icon" />
                <Typography className="card-form-suggested-text">
                  Suggested
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<East />}
                onClick={handleSuggestedClick}
                className="card-form-suggested-button"
              >
                {suggestedList.title}
              </Button>
            </Box>
          )}

          {/* Destination selects section */}
          <Box className={"card-form-section"} sx={{ mb: 2 }}>
            {!isCopyMode && (
              <Typography className="card-form-section-title">
                Select destination
              </Typography>
            )}

            <CustomSelect
              id={SELECT_IDS.BOARD}
              name="boardId"
              label="Board"
              labelId={`${SELECT_IDS.BOARD}-label`}
              value={values.boardId}
              open={openSelectMenuId === SELECT_IDS.BOARD}
              onOpen={() => handleSelectOpen(SELECT_IDS.BOARD)}
              onClose={handleSelectClose}
              onChange={handleBoardChange}
              options={boards.map(b => ({
                value: b._id,
                label: b.title,
              }))}
              className={"card-form-select"}
              sx={{ mb: 2 }}
            />

            <Box
              className={"card-form-selects-row"}
              display={"flex"}
              gap={2}
              sx={{ mb: 2 }}
            >
              <CustomSelect
                id={SELECT_IDS.LIST}
                name="listId"
                label="List"
                labelId={`${SELECT_IDS.LIST}-label`}
                value={values.listId}
                open={openSelectMenuId === SELECT_IDS.LIST}
                onOpen={() => handleSelectOpen(SELECT_IDS.LIST)}
                onClose={handleSelectClose}
                onChange={handleListChange}
                options={selectedBoardLists.map(list => ({
                  value: list.id,
                  label: list.title,
                }))}
              />

              <CustomSelect
                id={SELECT_IDS.POSITION}
                name="position"
                label="Position"
                labelId={`${SELECT_IDS.POSITION}-label`}
                value={values.position.toString()}
                open={openSelectMenuId === SELECT_IDS.POSITION}
                onOpen={() => handleSelectOpen(SELECT_IDS.POSITION)}
                onClose={handleSelectClose}
                onChange={handlePositionChange}
                options={Array.from({ length: maxPosition }, (_, i) => ({
                  value: i,
                  label: (i + 1).toString(),
                }))}
              />
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <ActionButton
              type="submit"
              variant="contained"
              size="small"
              disabled={isCopyMode && !values.title.trim()}
            >
              {submitButtonText}
            </ActionButton>
          </Box>
        </form>
      </Box>
    </PopoverMUI>
  );
}
