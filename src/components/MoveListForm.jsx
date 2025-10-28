import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormState } from "../hooks/useFormState";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ActionButton from "./ui/buttons/ActionButton";
import { loadBoards } from "../store/actions/board-actions";

export default function MoveListForm({ onSubmit, onCancel }) {
  const boards = useSelector(state => state.boards.boards);
  const currentBoard = useSelector(state => state.boards.board);
  const activeListIndex = useSelector(state => state.ui.lists.activeListIndex);

  useEffect(() => {
    if (!boards || boards.length === 0) {
      loadBoards();
    }
  }, []);

  const defaultBoardId =
    currentBoard?._id || (boards[0] && boards[0]._id) || "";
  const selectedBoard = boards.find(b => b._id === currentBoard._id) ||
    boards.find(b => b._id === defaultBoardId) ||
    boards[0] || { lists: [] };

  const { values, handleChange, setValues } = useFormState({
    boardId: defaultBoardId,
    position: activeListIndex || 0,
  });

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
    onSubmit({
      boardId: values.boardId,
      position: values.position,
    });
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
