import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Close from "@mui/icons-material/Close";
import { ActionButton } from "./ui/buttons/ActionButton";
import { SquareIconButton } from "./ui/buttons/SquareIconButton";
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
        <ActionButton
          className="add-card-contained-button"
          type="submit"
          size="small"
        >
          Add card
        </ActionButton>
        <SquareIconButton
          icon={<Close />}
          aria-label="Close"
          onClick={onHideAddCardForm}
        />
      </div>
    </form>
  );
}
