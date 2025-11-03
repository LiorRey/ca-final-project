import { useFormState } from "../hooks/useFormState";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ActionButton from "./ui/buttons/ActionButton";

export function MoveListForm({
  currentBoard,
  boards,
  activeListIndex,
  onSubmit,
  onCancel,
}) {
  const defaultBoardId = currentBoard._id;
  const { values, handleChange, setValues } = useFormState({
    boardId: defaultBoardId,
    position: activeListIndex || 0,
  });
  const selectedBoard = boards.find(b => b._id === values.boardId);

  // handle position when board changes
  function handleBoardChange(e) {
    handleChange(e);
    const boardId = e.target.value;
    const position = boardId === currentBoard._id ? activeListIndex : 0;
    setValues(v => ({
      ...v,
      position,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { boardId: targetBoardId, position: targetPosition } = values;

    onSubmit({ targetBoardId, targetPosition });
  }

  return (
    <form className="move-list-form" onSubmit={handleSubmit}>
      <Box mb={2}>
        <Typography
          variant="subtitle2"
          component="label"
          htmlFor="move-list-board-select"
          sx={{ mb: 0.5, fontWeight: 500 }}
        >
          Board
        </Typography>
        <FormControl fullWidth margin="dense">
          <Select
            id="move-list-board-select"
            name="boardId"
            value={boards.length > 0 ? values.boardId : ""}
            onChange={handleBoardChange}
            disabled={boards.length === 0}
            size="small"
          >
            {boards.map(b => (
              <MenuItem key={b._id} value={b._id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mb={2}>
        <Typography
          variant="subtitle2"
          component="label"
          htmlFor="move-list-position-select"
          sx={{ mb: 0.5, fontWeight: 500 }}
        >
          Position
        </Typography>
        <FormControl fullWidth margin="dense">
          <Select
            id="move-list-position-select"
            name="position"
            value={
              selectedBoard.lists && selectedBoard.lists.length > 0
                ? values.position
                : ""
            }
            onChange={handleChange}
            disabled={!selectedBoard.lists || selectedBoard.lists.length === 0}
            size="small"
          >
            {selectedBoard.lists &&
              selectedBoard.lists.map((list, index) => (
                <MenuItem key={index} value={index}>
                  {index + 1}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" gap={2} mt={2}>
        <ActionButton type="submit" variant="contained" color="primary">
          Move
        </ActionButton>
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </form>
  );
}
