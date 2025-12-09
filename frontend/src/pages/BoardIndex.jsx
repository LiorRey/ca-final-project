import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadBoards,
  loadBoard,
  createBoard,
  setBoardSearch,
} from "../store/actions/board-actions";

import AddIcon from "@mui/icons-material/Add";
import { BoardPreview } from "../components/ui/BoardPreview";

export function BoardIndex() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const boards = useSelector(state => state.boards.boards);
  const boardSearch = useSelector(state => state.boards.boardSearch);

  useEffect(() => {
    loadBoards();
    dispatch(setBoardSearch(""));
  }, []);

  async function onOpenBoard(boardId) {
    await loadBoard(boardId);
    await navigate(`/board/${boardId}`);
  }

  async function onCreateBoard() {
    const newBoard = await createBoard({
      title: "New Board",
      lists: [],
      appearance: { background: "#0079bf" },
    });

    onOpenBoard(newBoard._id);
  }

  const filteredBoards = useMemo(() => {
    const term = boardSearch.toLowerCase();
    return boards.filter(board => board.title.toLowerCase().includes(term));
  }, [boardSearch, boards]);

  return (
    <section className="board-index-page">
      <header className="board-index-header">
        <h1>Boards</h1>
      </header>

      <section className="board-section">
        <h2>All Boards</h2>
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
