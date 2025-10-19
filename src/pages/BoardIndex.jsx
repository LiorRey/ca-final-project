import { useEffect } from "react";
import { BoardDetails } from "./BoardDetails";
import { boardService } from "../services/board";
import { loadBoard } from "../store/actions/board-actions";

export function BoardIndex() {
  useEffect(() => {
    fetchBoard();
  }, []);

  async function fetchBoard() {
    const boards = await boardService.query();
    await loadBoard(boards[0]._id);
  }

  return (
    <section className="board-index">
      <BoardDetails />
    </section>
  );
}
