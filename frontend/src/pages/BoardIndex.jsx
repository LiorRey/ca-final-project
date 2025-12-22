import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { loadBoards, loadBoard } from "../store/actions/board-actions";
import { BoardPreview } from "../components/ui/BoardPreview";
import { CreateBoardForm } from "../components/CreateBoardForm";
import { Avatar } from "../components/ui/Avatar";
import { selectCurrentUser } from "../store/selectors/auth-selectors";

export function BoardIndex() {
  const [createFormAnchorEl, setCreateFormAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boards = useSelector(state => state.boards.boards);
  const currentUser = useSelector(selectCurrentUser);

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

  const userBoards = useMemo(() => {
    return filteredBoards.filter(board => board.createdBy === currentUser?._id);
  }, [filteredBoards, currentUser]);

  return (
    <section className="board-index-page">
      <div className="board-index-content">
        {currentUser && (
          <header className="workspace-header">
            <Avatar user={currentUser} size={64} />
            <div className="workspace-info">
              <div className="workspace-name">
                <h1>{currentUser.fullname}'s workspace</h1>
              </div>
              <div className="workspace-visibility">
                <LockOutlinedIcon fontSize="inherit" />
                <span>Private</span>
              </div>
            </div>
          </header>
        )}

        <hr className="workspace-divider" />

        {userBoards.length > 0 && (
          <section className="board-section">
            <h2 className="section-title">
              <PersonOutlineIcon />
              Your boards
            </h2>
            <div className="boards-list">
              {userBoards.map(board => (
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
                <span className="remaining-count">
                  {10 - boards.length} remaining
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="board-section">
          <h2 className="section-title">
            <PersonOutlineIcon />
            All boards in this Workspace
          </h2>
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
      </div>
    </section>
  );
}
