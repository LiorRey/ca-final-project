import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loadBoards,
  loadBoard,
  createBoard,
} from "../store/actions/board-actions";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

export function BoardIndex() {
  const [search, setSearch] = useState("");
  const boards = useSelector(state => state.boards.boards);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
  }, []);

  async function onOpenBoard(board) {
    await loadBoard(board._id);
    navigate(`/board/${board._id}`);
  }

  async function onCreateBoard() {
    const newBoard = await createBoard({
      title: "New Board",
      lists: [],
      appearance: { background: "#0079bf" },
    });

    onOpenBoard(newBoard);
  }

  // Filter boards by search
  const filteredBoards = useMemo(() => {
    const term = search.toLowerCase();
    return boards.filter(b => b.title.toLowerCase().includes(term));
  }, [search, boards]);

  return (
    <section className="board-index-page">
      <header className="board-index-header">
        <h1>Boards</h1>

        <div className="board-search-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search boards…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* 📋 All Boards */}
      <section className="board-section">
        <h2>All Boards</h2>
        <div className="boards-list">
          {filteredBoards.map(board => (
            <BoardPreview key={board._id} board={board} onOpen={onOpenBoard} />
          ))}

          {/* ➕ Create Board Tile */}
          <div className="board-tile create-tile" onClick={onCreateBoard}>
            <AddIcon />
            <span>Create new board</span>
          </div>
        </div>
      </section>
    </section>
  );
}

// SINGLE BOARD PREVIEW COMPONENT
function BoardPreview({ board, onOpen }) {
  const backgroundClass = board?.appearance
    ? `bg-${board?.appearance?.background || "blue"}`
    : "bg-blue";

  return (
    <div
      className={`board-tile board-bg-base ${backgroundClass}`}
      onClick={() => onOpen(board)}
    >
      <span className="board-preview-title">{board.title}</span>
    </div>
  );
}
