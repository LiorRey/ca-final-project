import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CardModal } from "../components/CardModal";
import { useState, useEffect } from "react";
import { deleteCard, editCard } from "../store/actions/board-actions";

export function CardDetails() {
  const { boardId, listId, cardId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const board = useSelector(s => s.boards.board);
  const list = board?.lists?.find(l => l.id === listId);
  const card = list?.cards?.find(c => c.id === cardId);

  useEffect(() => {
    setModalOpen(true);
  }, [cardId]);

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
    return null;
  }

  const cardLabels =
    board.labels && card.labels && card.labels.length > 0
      ? card.labels
          .map(labelId => board.labels.find(l => l.id === labelId))
          .filter(Boolean)
      : [];

  return (
    <CardModal
      cardLabels={cardLabels}
      listTitle={list.name}
      card={card}
      onDeleteCard={handleDeleteCard}
      onEditCard={handleEditCard}
      onClose={handleCloseModal}
      isOpen={modalOpen}
    />
  );
}
