import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BoardDetails } from "./BoardDetails";
import { boardService } from "../services/board";
import { loadBoard, loadBoards } from "../store/actions/board-actions";

// export function BoardIndex() {
//   const boards = useSelector(state => state.boards.boards);
//   const navigate = useNavigate();

//   async function fetchBoard() {
//     const boards = await boardService.query();
//     await loadBoard(boards[0]._id);
//   }

//   useEffect(() => {
//     loadBoards();
//   }, []);

//   useEffect(() => {
//     if (boards.length === 0) return;
//     fetchBoard();
//     navigate(`/board/${boards[0]._id}`);
//   }, [boards, navigate]);

//   return (
//     <section className="board-index">
//       <div>Loading boards...</div>
//     </section>
//   );
// }

export function BoardIndex() {
  const boards = useSelector(state => state.boards.boards);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (boards.length === 0) return;

    navigate(`/board/${boards[0]._id}`);
  }, [boards]);

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
