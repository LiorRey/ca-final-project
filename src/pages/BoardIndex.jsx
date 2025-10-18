import { useState, useEffect } from "react";
import { BoardDetails } from "./BoardDetails";
import { boardService } from "../services/board";

export function BoardIndex() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetchBoard();
  }, []);

  async function fetchBoard() {
    const boards = await boardService.query();
    setBoard(boards[0]);
  }

  if (!board) return <div>Loading board...</div>;

  return (
    <section className="board-index">
      <BoardDetails board={board} />
    </section>
  );
}
