import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Close from "@mui/icons-material/Close";
import { SquareIconButton } from "./ui/buttons/SquareIconButton";
import { boardService } from "../services/board/board-service-local";
import { addCard } from "../store/actions/board-actions";

export function AddCardForm({
  listId,
  onCardAdded,
  onHideAddCardForm,
  addCardToEnd = true,
}) {
  const [title, setTitle] = useState("");
  const boardId = useSelector(state => state.boards.board._id);

  async function handleAddCard() {
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
    <section className="add-card-container">
      <div className="card-content">
        <input
          type="text"
          className="card-title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter a title or paste a link"
          autoFocus
        />
      </div>
      <div className="add-card-buttons-container">
        <Button
          className="add-card-contained-button"
          variant="contained"
          size="large"
          onClick={handleAddCard}
          onMouseDown={e => e.preventDefault()}
        >
          Add card
        </Button>
        <button className="icon-button" onClick={onHideAddCardForm}>
          ✕
        </button>
        {/* <SquareIconButton
                      icon={<Close />}
                      aria-label="Close"
                      onClick={handleHideAddCard}
                    /> */}
      </div>
    </section>
  );
}
