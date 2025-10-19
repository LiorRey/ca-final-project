import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BoardDetails } from "./BoardDetails";
import { boardService } from "../services/board";
import { loadBoard } from "../store/actions/board-actions";

export function BoardIndex() {
  const board = useSelector(state => state.boards.board);

  useEffect(() => {
    fetchBoard();
  }, []);

  async function fetchBoard() {
    const boards = await boardService.query();
    await loadBoard(boards[0]._id);
  }

  if (!board) return <div>Loading board...</div>;

  return (
    <section className="board-index">
      <BoardDetails board={board} />
    </section>
  );
}
