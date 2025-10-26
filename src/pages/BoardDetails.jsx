import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
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
import {
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
} from "../services/filter-service";
import { useCardFilters } from "../hooks/useCardFilters";
import { SCROLL_DIRECTION, useScrollTo } from "../hooks/useScrollTo";

export function BoardDetails() {
  const [activeAddCardListId, setActiveAddCardListId] = useState(null);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const board = useSelector(state => state.boards.board);
  const [labelsIsOpen, setLabelsIsOpen] = useState(false);
  const boardCanvasRef = useRef(null);
  const scrollBoardToEnd = useScrollTo(boardCanvasRef);
  const { filters, updateFilters } = useCardFilters();

  useEffect(() => {
    loadBoard(params.boardId, filters);
  }, [params.boardId, filters]);

  useEffect(() => {
    const filterBy = parseFiltersFromSearchParams(searchParams);
    updateFilters(filterBy);
  }, []);

  useEffect(() => {
    const filterBy = serializeFiltersToSearchParams(filters);
    setSearchParams(filterBy);
  }, [filters, setSearchParams]);

  function onCopyList(listId, newName) {
    try {
      const updatedLists = boardService.copyList(board, listId, newName);
      updateBoard(board, {
        key: "lists",
        value: updatedLists,
      });
    } catch (error) {
      console.error("List copy failed:", error);
      showErrorMsg(`Unable to copy the list: ${listId}`);
    }
  }

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

  async function onAddList(newList) {
    await updateBoard(board, {
      key: "lists",
      value: [...board.lists, newList],
    });

    requestAnimationFrame(() =>
      scrollBoardToEnd({ direction: SCROLL_DIRECTION.HORIZONTAL })
    );
  }

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
          {board.lists.map(list => (
            <li key={list.id}>
              <List
                key={list.id}
                list={list}
                labelsIsOpen={labelsIsOpen}
                setLabelsIsOpen={setLabelsIsOpen}
                boardLabels={board.labels}
                onRemoveList={onRemoveList}
                onUpdateList={onUpdateList}
                onCopyList={onCopyList}
                isAddingCard={activeAddCardListId === list.id}
                setActiveAddCardListId={setActiveAddCardListId}
              />
            </li>
          ))}
          <li>
            <AddList onAddList={onAddList} />
          </li>
        </ul>
        <nav className="board-footer">
          <Footer />
        </nav>
      </div>
    </section>
  );
}
