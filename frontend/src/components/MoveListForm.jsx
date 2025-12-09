import { useFormState } from "../hooks/useFormState";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ActionButton } from "./ui/buttons/ActionButton";
import { CustomAutoComplete } from "./ui/CustomAutoComplete";

export function MoveListForm({
  currentBoard,
  boards,
  activeListIndex,
  onSubmit,
  onCancel,
}) {
  const defaultBoardId = currentBoard._id;
  const { values, setValues } = useFormState({
    boardId: defaultBoardId,
    position: activeListIndex || 0,
  });
  const selectedBoard = boards.find(b => b._id === values.boardId);

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
            disabled={!selectedBoard.lists || selectedBoard.lists.length === 0}
            options={
              selectedBoard.lists && selectedBoard.lists.length > 0
                ? Array.from(
                    { length: selectedBoard.lists.length },
                    (_, i) => ({
                      _id: i,
                      title: (i + 1).toString(),
                    })
                  )
                : []
            }
          />
        </Box>
        <Box display="flex" gap={2} mt={3}>
          <ActionButton type="submit" variant="contained" color="primary">
            Move
          </ActionButton>
          <Button type="button" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
}
