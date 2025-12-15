import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { loadBoards, loadBoard } from "../store/actions/board-actions";
import { BoardPreview } from "../components/ui/BoardPreview";
import { CreateBoardForm } from "../components/CreateBoardForm";

export function BoardIndex() {
  const [createFormAnchorEl, setCreateFormAnchorEl] = useState(null);
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

          <div
            className="board-tile create-tile"
            onClick={ev => setCreateFormAnchorEl(ev.currentTarget)}
          >
            <AddIcon />
            <span>Create new board</span>
          </div>
        </div>
      </section>

      <CreateBoardForm
        anchorEl={createFormAnchorEl}
        isCreateFormOpen={Boolean(createFormAnchorEl)}
        onCloseCreateForm={() => setCreateFormAnchorEl(null)}
      />
    </section>
  );
}
