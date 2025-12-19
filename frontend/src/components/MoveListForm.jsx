import { useFormState } from "../hooks/useFormState";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ActionButton } from "./ui/buttons/ActionButton";
import { CustomAutoComplete } from "./ui/CustomAutoComplete";
import { useEffect, useState } from "react";
import { boardService } from "../services/board";

export function MoveListForm({
  currentBoard,
  activeListIndex,
  onSubmit,
  onCancel,
}) {
  const defaultBoardId = currentBoard._id;
  const { values, setValues } = useFormState({
    boardId: defaultBoardId,
    position: activeListIndex || 0,
  });
  const [boards, setBoards] = useState([]);
  const [selectedBoardLists, setSelectedBoardLists] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const boardNames = await boardService.getBoardPreviews();
        setBoards(boardNames);
      } catch (error) {
        console.error("Error loading boards:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (!values.boardId) return;
      try {
        const lists = await boardService.getBoardListPreviews(values.boardId);
        setSelectedBoardLists(lists);
      } catch (error) {
        console.error("Error loading lists:", error);
        setSelectedBoardLists([]);
      }
    })();
  }, [values.boardId]);

  // handle position when board changes
  function handleBoardChange(boardId) {
    const position = boardId === currentBoard._id ? activeListIndex : 0;
    setValues(v => ({
      ...v,
      boardId,
      position,
    }));
  }

  function handlePositionChange(position) {
    setValues(v => ({
      ...v,
      position: parseInt(position) || 0,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { boardId: targetBoardId, position: targetPosition } = values;

    onSubmit({ targetBoardId, targetPosition });
  }

  return (
    <form className="move-list-form" onSubmit={handleSubmit}>
      <Box sx={{ p: 2 }}>
        <Box mb={3}>
          {/* <Typography
          variant="subtitle2"
          component="label"
          htmlFor="move-list-board-select"
          sx={{ mb: 0.5, fontWeight: 500 }}
        >
          Board
        </Typography> */}
          <CustomAutoComplete
            id="move-list-board-select"
            name="boardId"
            label="Board"
            value={values.boardId}
            onChange={handleBoardChange}
            disabled={boards.length === 0}
            options={boards.map(b => ({
              _id: b._id,
              title: b.title,
            }))}
          />
        </Box>
        <Box mb={3}>
          {/* <Typography
          variant="subtitle2"
          component="label"
          htmlFor="move-list-position-select"
          sx={{ mb: 0.5, fontWeight: 500 }}
        >
          Position
        </Typography> */}
          <CustomAutoComplete
            id="move-list-position-select"
            name="position"
            label="Position"
            value={values.position}
            onChange={handlePositionChange}
            disabled={!selectedBoardLists || selectedBoardLists.length === 0}
            options={
              selectedBoardLists && selectedBoardLists.length > 0
                ? Array.from({ length: selectedBoardLists.length }, (_, i) => ({
                    _id: i,
                    title: (i + 1).toString(),
                  }))
                : []
            }
          />
        </Box>
        <Box display="flex" gap={2} mt={3}>
          <Button type="submit">Move</Button>
          <Button type="button" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
}
