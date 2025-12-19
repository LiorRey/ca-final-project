import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import East from "@mui/icons-material/East";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import { useFormState } from "../../hooks/useFormState";
import { CustomAutoComplete } from "../ui/CustomAutoComplete";
import { boardService } from "../../services/board";

const SELECT_IDS = {
  BOARD: "card-board-select",
  LIST: "card-list-select",
  POSITION: "card-position-select",
};

export function CardActionForm({
  onCopySubmit,
  onMoveSubmit,
  isCopyMode,
  card,
  listId,
  submitButtonText,
}) {
  const board = useSelector(state => state.boards.board);
  const [boards, setBoards] = useState([]);
  const [selectedBoardLists, setSelectedBoardLists] = useState([]);

  const cardTitle = card?.title || "";

  useEffect(() => {
    async function loadBoards() {
      try {
        const boardNames = await boardService.getBoardPreviews();
        setBoards(boardNames);
      } catch (error) {
        console.error("Error loading boards:", error);
      }
    }
    loadBoards();
  }, []);

  const initialValues = useMemo(() => {
    const currentList = board?.lists?.find(l => l._id === listId);
    const currentPosition =
      currentList?.cards?.findIndex(c => c._id === card?._id) ?? 0;

    const baseValues = {
      boardId: board?._id || boards[0]?._id || "",
      listId: listId || board?.lists?.[0]?._id || "",
      position: currentPosition,
    };

    if (isCopyMode) {
      return {
        ...baseValues,
        title: cardTitle,
        keepLabels: true,
        keepMembers: true,
      };
    }
    return baseValues;
  }, [isCopyMode, cardTitle, board, card, listId, boards]);

  const { values, handleChange, setValues } = useFormState(initialValues);

  useEffect(() => {
    async function loadLists() {
      if (!values.boardId) return;
      try {
        const lists = await boardService.getBoardListPreviews(values.boardId);
        setSelectedBoardLists(lists);
      } catch (error) {
        console.error("Error loading lists:", error);
        setSelectedBoardLists([]);
      }
    }
    loadLists();
  }, [values.boardId]);

  const selectedList = useMemo(
    () => selectedBoardLists.find(l => l._id === values.listId) || null,
    [selectedBoardLists, values.listId]
  );

  const suggestedList = useMemo(
    () => selectedBoardLists.find(l => l._id === values.listId) || null,
    [selectedBoardLists, values.listId]
  );

  const maxPosition = useMemo(
    () => (selectedList?.cardCount ? selectedList.cardCount + 1 : 1),
    [selectedList]
  );

  const cardLabels = card?.labelIds || [];
  const cardLabelsCount = Array.isArray(cardLabels) ? cardLabels.length : 0;
  const cardMembers = card?.assignedTo || [];
  const cardMembersCount = Array.isArray(cardMembers) ? cardMembers.length : 0;

  async function handleBoardChange(newBoardId) {
    try {
      const lists = await boardService.getBoardListPreviews(newBoardId);
      const firstListId = lists[0]?._id || "";

      setValues(prev => ({
        ...prev,
        boardId: newBoardId,
        listId: firstListId,
        position: 0,
      }));
    } catch (error) {
      console.error("Error loading lists for board:", error);
    }
  }

  function handleSuggestedClick() {
    if (suggestedList) {
      setValues(prev => ({
        ...prev,
        listId: suggestedList._id,
      }));
    }
  }

  function handleListChange(listId) {
    setValues(prev => ({
      ...prev,
      listId,
      position: 0,
    }));
  }

  function handlePositionChange(position) {
    setValues(prev => ({
      ...prev,
      position,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (isCopyMode) {
      const newTitle = values.title.trim();
      if (!newTitle) return;

      onCopySubmit({
        title: newTitle,
        boardId: values.boardId,
        listId: values.listId,
        position: parseInt(values.position),
        keepLabels: values.keepLabels,
        keepMembers: values.keepMembers,
      });
    } else {
      onMoveSubmit({
        boardId: values.boardId,
        listId: values.listId,
        position: parseInt(values.position),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-form-menu">
      {isCopyMode && (
        <Box className="card-form-section">
          <Typography className="card-form-section-label">Title</Typography>
          <TextareaAutosize
            id="card-textfield"
            name="title"
            value={values.title}
            onChange={handleChange}
            onClick={e => e.stopPropagation()}
            minRows={2}
            className="card-form-textarea"
          />
        </Box>
      )}

      {isCopyMode && (
        <Box className="card-form-section">
          <Typography className="card-form-section-label">Keep...</Typography>
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

      {!isCopyMode && suggestedList && (
        <Box className="card-form-suggested-section" sx={{ mb: 2 }}>
          <Box className="card-form-suggested-header" sx={{ my: 2 }}>
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

      <Box sx={{ mb: 2 }}>
        {!isCopyMode && (
          <Typography className="card-form-section-title" sx={{ mb: 3 }}>
            Select destination
          </Typography>
        )}
        <Box sx={{ mb: 2 }}>
          <CustomAutoComplete
            id={SELECT_IDS.BOARD}
            name="boardId"
            label="Board"
            value={values.boardId}
            onChange={handleBoardChange}
            options={boards.map(b => ({
              _id: b._id,
              title: b.title,
            }))}
          />
        </Box>

        <Box
          className={"card-form-selects-row"}
          display={"flex"}
          gap={2}
          sx={{ mb: 2 }}
        >
          <CustomAutoComplete
            id={SELECT_IDS.LIST}
            name="listId"
            label="List"
            value={values.listId}
            onChange={handleListChange}
            options={selectedBoardLists}
          />

          <CustomAutoComplete
            id={SELECT_IDS.POSITION}
            name="position"
            label="Position"
            value={values.position}
            onChange={handlePositionChange}
            options={Array.from({ length: maxPosition }, (_, i) => ({
              _id: i,
              title: (i + 1).toString(),
            }))}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" disabled={isCopyMode && !values.title.trim()}>
          {submitButtonText}
        </Button>
      </Box>
    </form>
  );
}
