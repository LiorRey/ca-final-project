import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import {
  loadBoards,
  loadBoard,
  createBoard,
} from "../store/actions/board-actions";
import { BoardPreview } from "../components/ui/BoardPreview";

export function BoardIndex() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boards = useSelector(state => state.boards.boards);

  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    loadBoards();
  }, []);

  async function onOpenBoard(boardId) {
    await loadBoard(boardId);
    navigate(`/board/${boardId}`);
  }

  async function onCreateBoard() {
    const newBoard = await createBoard({
      title: "New Board",
      lists: [],
      appearance: { background: "blue" },
    });

    onOpenBoard(newBoard._id);
  }

  const filteredBoards = useMemo(() => {
    return boards.filter(board =>
      board.title.toLowerCase().includes(searchTerm)
    );
  }, [boards, searchTerm]);

  return (
    <section className="board-index-page">
      <header className="board-index-header">
        <h1>All boards</h1>
      </header>

      <section className="board-section">
        <div className="boards-list">
          {filteredBoards.map(board => (
            <BoardPreview
              key={board._id}
              boardTitle={board.title}
              boardAppearance={board.appearance}
              onOpen={() => onOpenBoard(board._id)}
            />
          ))}

          <div className="board-tile create-tile" onClick={onCreateBoard}>
            <AddIcon />
            <span>Create new board</span>
          </div>
        </div>
      </section>
    </section>
  );
}
