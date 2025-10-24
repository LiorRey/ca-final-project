import { useEffect, useMemo, useRef, useState } from "react";
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
import { FilterMenu } from "../components/FilterMenu";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus-service";
import { getFilteredBoard } from "../services/filter-service";
import { useCardFilters } from "../hooks/useCardFilters";
import { useScrollToEnd } from "../hooks/useScrollToEnd";
import { useEffectUpdate } from "../hooks/useEffectUpdate";

export function BoardDetails() {
  const params = useParams();
  const board = useSelector(state => state.boards.board);
  const { filters } = useCardFilters();
  const [boardCanvasRef, scrollBoardToEnd] = useScrollToEnd();
  const [activeAddCardListId, setActiveAddCardListId] = useState(null);
  const didLoadOnce = useRef(false);

  useEffect(() => {
    didLoadOnce.current = false;
    loadBoard(params.boardId);
  }, [params.boardId]);

  useEffectUpdate(() => {
    if (!board?.lists?.length) return;

    if (!didLoadOnce.current) {
      didLoadOnce.current = true;
      return;
    }

    scrollBoardToEnd({ horizontal: true });
  }, [board?.lists?.length]);

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

  function onAddList(newList) {
    updateBoard(board, {
      key: "lists",
      value: [...board.lists, newList],
    });
  }

  const filteredBoard = useMemo(() => {
    if (!board) return null;
    return getFilteredBoard(board, filters);
  }, [board, filters]);

  if (!board) return <div>Loading board...</div>;

  return (
    <section className="board-container">
      <header className="board-header">
        <h2 className="board-title">{board.name}</h2>
        <div className="board-header-right">
          <FilterMenu />
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
          {filteredBoard.lists.map(list => (
            <li key={list.id}>
              <List
                key={list.id}
                list={list}
                boardLabels={board.labels}
                onRemoveList={onRemoveList}
                onUpdateList={onUpdateList}
                isAddingCard={activeAddCardListId === list.id}
                onSetAddingCard={setActiveAddCardListId}
              />
            </li>
          ))}
          <li>
            <AddList
              onAddList={onAddList}
              onScrollToEnd={() => scrollBoardToEnd({ horizontal: true })}
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
