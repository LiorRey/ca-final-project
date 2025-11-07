import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ActionButton from "./ui/buttons/ActionButton";

export default function CopyCardForm({ card, onSubmit, onCancel }) {
  const board = useSelector(state => state.boards.board);
  const textareaRef = useRef(null);
  const cardTitle = card?.title || "";
  const [textareaValue, setTextareaValue] = useState(cardTitle);
  const [activeTab, setActiveTab] = useState(1); // 0 = Inbox, 1 = Board

  // Get card labels count (labels can be IDs or objects)
  const cardLabels = card?.labels || [];
  const cardLabelsCount = Array.isArray(cardLabels) ? cardLabels.length : 0;

  // Get card members count
  const cardMembers = card?.assignedTo || [];
  const cardMembersCount = Array.isArray(cardMembers) ? cardMembers.length : 0;

  // Get available lists for selected board
  const availableLists = board?.lists || [];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const newName = textareaValue.trim();
    if (!newName) return;

    onSubmit(newName);
    setTextareaValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      if (onCancel) onCancel();
      setTextareaValue(cardTitle);
    }
  }

  function handleTabChange(event, newValue) {
    setActiveTab(newValue);
  }

  return (
    <form onSubmit={handleSubmit} className="copy-card-form">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Inbox" />
          <Tab label="Board" />
        </Tabs>
      </Box>

      <Box mb={2}>
        <label
          htmlFor="copy-card-textfield"
          style={{ fontWeight: 500, fontSize: 15, display: "block", mb: 1 }}
        >
          Name
        </label>
        <TextareaAutosize
          id="copy-card-textfield"
          className="copy-card-textfield"
          ref={textareaRef}
          value={textareaValue}
          onChange={e => setTextareaValue(e.target.value)}
          onKeyDown={handleKeyDown}
          minRows={2}
          autoFocus
          style={{ width: "100%" }}
        />
      </Box>

      <Box mb={2}>
        <label
          style={{ fontWeight: 500, fontSize: 15, display: "block", mb: 1 }}
        >
          Keep...
        </label>
        <Box>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={`Labels (${cardLabelsCount})`}
          />
        </Box>
        <Box>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={`Members (${cardMembersCount})`}
          />
        </Box>
      </Box>

      {activeTab === 1 && (
        <Box mb={2}>
          <label
            style={{ fontWeight: 500, fontSize: 15, display: "block", mb: 1 }}
          >
            Copy to...
          </label>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="board-select-label">Board</InputLabel>
            <Select
              labelId="board-select-label"
              id="board-select"
              value={board?._id || ""}
              label="Board"
            >
              {board && <MenuItem value={board._id}>{board.name}</MenuItem>}
            </Select>
          </FormControl>
          <Box display="flex" gap={2} sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="list-select-label">List</InputLabel>
              <Select
                labelId="list-select-label"
                id="list-select"
                value={availableLists[0]?.id || ""}
                label="List"
              >
                {availableLists.map(list => (
                  <MenuItem key={list.id} value={list.id}>
                    {list.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="position-select-label">Position</InputLabel>
              <Select
                labelId="position-select-label"
                id="position-select"
                value="2"
                label="Position"
              >
                {Array.from({ length: availableLists.length + 1 }, (_, i) => (
                  <MenuItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end">
        <ActionButton
          type="submit"
          variant="contained"
          size="small"
          disabled={!textareaValue.trim()}
        >
          Create card
        </ActionButton>
      </Box>
    </form>
  );
}
