import { useState, useRef, useEffect } from "react";

import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ActionButton from "./ui/buttons/ActionButton";

export function CopyListForm({ initialValue, onCopy, onCancel }) {
  const textareaRef = useRef(null);
  const [textareaValue, setTextareaValue] = useState(initialValue || "");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const newName = textareaValue.trim();
    if (!newName) return;

    onCopy(newName);
    setTextareaValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      if (onCancel) onCancel();
      setTextareaValue(initialValue);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="copy-list-form">
      <Box mb={1}>
        <label
          htmlFor="copy-list-textfield"
          style={{ fontWeight: 500, fontSize: 15 }}
        >
          Name
        </label>
      </Box>
      <TextareaAutosize
        id="copy-list-textfield"
        className="copy-list-textfield"
        ref={textareaRef}
        value={textareaValue}
        onChange={e => setTextareaValue(e.target.value)}
        onKeyDown={handleKeyDown}
        minRows={2}
        autoFocus
      />
      <Box display="flex" gap={1}>
        <ActionButton
          type="submit"
          variant="contained"
          size="small"
          disabled={!textareaValue.trim()}
        >
          Create list
        </ActionButton>
        <Button
          type="button"
          variant="contained"
          size="small"
          onClick={onCancel}
        >
          Back
        </Button>
      </Box>
    </form>
  );
}
