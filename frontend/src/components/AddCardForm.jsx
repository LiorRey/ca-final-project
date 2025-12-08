import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { boardService } from "../services/board/board-service-local";
import { addCard } from "../store/actions/board-actions";

export function AddCardForm({
  listId,
  addCardToEnd = true,
  onCardAdded,
  onHideAddCardForm,
}) {
  const [title, setTitle] = useState("");
  const boardId = useSelector(state => state.boards.board._id);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleAddCard(e) {
    e.preventDefault();

    if (!title) {
      onHideAddCardForm();
      return;
    }

    const addedCard = {
      ...boardService.getEmptyCard(),
      title,
    };

    await addCard(boardId, listId, addedCard, addCardToEnd);
    setTitle("");
    onCardAdded(addedCard, addCardToEnd);
  }

  return (
    <form className="add-card-form" onSubmit={handleAddCard}>
      <div className="card-content">
        <input
          type="text"
          className="card-title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter a title or paste a link"
          ref={inputRef}
        />
      </div>
      <div className="add-card-buttons-container">
        <Button
          onClick={handleAddCard}
          onMouseDown={e => e.preventDefault()}
          className="add-submit-button"
          type="submit"
        >
          Add card
        </Button>
        <IconButton
          sx={{
            margin: "0.5rem 0 0 0",
          }}
          size="small"
          aria-label="close"
          onClick={onHideAddCardForm}
          className="add-close-button"
        >
          <CloseIcon />
        </IconButton>
      </div>
    </form>
  );
}
