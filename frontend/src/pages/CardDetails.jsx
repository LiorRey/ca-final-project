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
  const backgroundClass = board?.appearance
    ? `bg-${board?.appearance?.background}`
    : "bg-blue";
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
    return <section className={`card-details-container ${backgroundClass}`} />;
  }

  return (
    <section className={`card-details-container ${backgroundClass}`}>
      <CardModal
        listTitle={list.title}
        card={card}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onClose={handleCloseModal}
        isOpen={modalOpen}
      />
    </section>
  );
}
