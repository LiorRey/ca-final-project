import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CardModal } from "../components/CardModal";
import { useState, useEffect } from "react";
import { updateBoard } from "../store/actions/board-actions";

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

  function handleDeleteCard() {
    try {
      const options = {
        listId: list.id,
        key: "cards",
        value: list.cards.filter(c => c.id !== card.id),
      };
      updateBoard(board, options);
      handleCloseModal();
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
      onClose={handleCloseModal}
      isOpen={modalOpen}
    />
  );
}
