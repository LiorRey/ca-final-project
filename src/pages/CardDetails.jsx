import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CardModal } from "../components/CardModal";
import { useState, useEffect } from "react";

export function CardDetails() {
  const { boardId, listId, cardId } = useParams();
  const board = useSelector(s => s.boards.board);
  const navigate = useNavigate();
  const list = board?.lists?.find(l => l.id === listId);
  const card = list?.cards?.find(c => c.id === cardId);
  const labels = board?.labels?.filter(l => card.labels.includes(l.id));

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(true);
  }, [cardId]);

  function handleCloseModal() {
    setModalOpen(false);
    navigate(`/board/${boardId}`);
  }

  if (!card) {
    console.log("Card not found, redirecting to board");
    navigate(`/board/${boardId}`);
    return null;
  }

  return (
    <CardModal
      listTitle={list.title}
      cardLabels={labels}
      card={card}
      onClose={handleCloseModal}
      isOpen={modalOpen}
    />
  );
}
