import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import Sort from "@mui/icons-material/Sort";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import LockOutlineRounded from "@mui/icons-material/LockOutlineRounded";

import { loadBoard, updateBoard } from "../store/actions/board-actions";
import { Footer } from "../components/Footer";
import { List } from "../components/List";
import { AddList } from "../components/AddList";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus-service";

export function BoardDetails() {
  const params = useParams();
  const board = useSelector(state => state.boards.board);
  const boardCanvasRef = useRef(null);

  useEffect(() => {
    loadBoard(params.boardId);
  }, [params.boardId]);

  async function onRemoveList(listId) {}

  async function onUpdateList(list, { cardId = null, key, value }) {
    try {
      const options = { listId: list.id, cardId, key, value };
      updateBoard(board, options);
      showSuccessMsg(`The list ${list.name} updated successfully!`);
    } catch (error) {
      console.error("List update failed:", error);
      showErrorMsg(`Unable to update the list: ${list.name}`);
    }
  }
  function onSubmitAddList(newList) {
    updateBoard(board, {
      key: "lists",
      value: [...board.lists, newList],
    });

    const applyDelay = true;
    scrollBoardToEnd(applyDelay);
  }

  function scrollBoardToEnd(applyDelay = false) {
    const DELAY_AFTER_LIST_ADD_MS = 400;
    const delay = applyDelay ? DELAY_AFTER_LIST_ADD_MS : 0;

    setTimeout(() => {
      const el = boardCanvasRef.current;
      if (el) {
        const scrollTarget = el.scrollWidth - el.clientWidth + 100;
        el.scrollTo({
          left: scrollTarget,
          behavior: "smooth",
        });
      }
    }, delay);
  }

  if (!board) return <div>Loading board...</div>;

  return (
    <section className="board-container">
      <header className="board-header">
        <h2 className="board-title">{board.name}</h2>
        <div className="board-header-right">
          <button className="icon-button">
            <Sort />
          </button>
          <button className="icon-button">
            <StarBorderRounded />
          </button>
          <button className="icon-button">
            <LockOutlineRounded />
          </button>
          <button className="icon-button">
            <MoreHoriz />
          </button>
        </div>
      </header>
      <div className="board-canvas" ref={boardCanvasRef}>
        <ul className="lists-list">
          {board.lists.map(list => (
            <li key={list.id}>
              <List
                key={list.id}
                list={list}
                onRemoveList={onRemoveList}
                onUpdateList={onUpdateList}
              />
            </li>
          ))}
          <li>
            <AddList
              onSubmit={onSubmitAddList}
              scrollBoardToEnd={scrollBoardToEnd}
            />
          </li>
        </ul>
        <nav className="board-footer">
          <Footer />
        </nav>
      </div>
    </section>
  );
}
