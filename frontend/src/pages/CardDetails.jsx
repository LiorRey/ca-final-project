import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CardModal } from "../components/CardModal";
import { useState, useEffect } from "react";
import {
  deleteCard,
  editCard,
  loadBoard,
} from "../store/actions/board-actions";

export function CardDetails() {
  const { boardId, listId, cardId } = useParams();
  const [modalOpen, setModalOpen] = useState(true);

  const navigate = useNavigate();
  const board = useSelector(s => s.boards.board);
  const list = board?.lists?.find(l => l._id === listId);
  const card = list?.cards?.find(c => c._id === cardId);

  useEffect(() => {
    if (!board || board._id !== boardId) {
      loadBoard(boardId);
    }
  }, [boardId, board]);

  function handleCloseModal() {
    setModalOpen(false);
    navigate(`/board/${boardId}`);
  }

  async function handleDeleteCard() {
    try {
      await deleteCard(boardId, cardId, listId);
      handleCloseModal();
    } catch (error) {
      console.error("Card delete failed:", error);
    }
  }

  async function handleEditCard(card) {
    try {
      await editCard(boardId, card, listId);
    } catch (error) {
      console.error("Card delete failed:", error);
    }
  }

  if (!card) {
    return <section className="board-container" />;
  }

  const cardLabels =
    board.labels && card.labels && card.labels.length > 0
      ? card.labels
          .map(labelId => board.labels.find(l => l._id === labelId))
          .filter(Boolean)
      : [];

  return (
    <section className="board-container">
      <CardModal
        boardId={boardId}
        listId={list._id}
        listTitle={list.title}
        card={card}
        cardLabels={cardLabels}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onClose={handleCloseModal}
        isOpen={modalOpen}
      />
    </section>
  );
}
