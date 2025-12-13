import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadBoard, loadBoards } from "../store/actions/board-actions";

export function BoardIndex() {
  const boards = useSelector(state => state.boards.boards);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
  }, []);

  async function handleBoardClick(boardId) {
    await loadBoard(boardId);
    navigate(`/board/${boardId}`);
  }

  const backgroundClass = board => {
    if (!board?.appearance?.background) return "bg-blue";
    return `bg-${board.appearance.background}`;
  };

  if (!boards || boards.length === 0) {
    return (
      <div className="board-index">
        <div className="board-index-loading">Loading boards…</div>
      </div>
    );
  }

  return (
    <div className="board-index">
      <div className="board-index-header">
        <h1>Your Boards</h1>
      </div>
      <div className="board-index-grid">
        {boards.map(board => (
          <div
            key={board._id}
            className={`board-card ${backgroundClass(board)}`}
            onClick={() => handleBoardClick(board._id)}
          >
            <div className="board-card-content">
              <h3 className="board-card-title">{board.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
