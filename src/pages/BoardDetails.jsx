import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import Sort from "@mui/icons-material/Sort";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import LockOutlineRounded from "@mui/icons-material/LockOutlineRounded";

import {
  loadBoard,
  loadBoards,
  updateBoard,
  copyList,
  moveAllCards,
  createList,
} from "../store/actions/board-actions";
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
  const boards = useSelector(state => state.boards.boards);
  const [labelsIsOpen, setLabelsIsOpen] = useState(false);
  const boardCanvasRef = useRef(null);
  const scrollBoardToEnd = useScrollTo(boardCanvasRef);
  const { filters, updateFilters } = useCardFilters();

  useEffect(() => {
    loadBoard(params.boardId, filters);
    if (!boards || boards.length === 0) {
      loadBoards();
    }
  }, [params.boardId, filters]);

  useEffect(() => {
    const filterBy = parseFiltersFromSearchParams(searchParams);
    updateFilters(filterBy);
  }, []);

  useEffect(() => {
    const filterBy = serializeFiltersToSearchParams(filters);
    setSearchParams(filterBy);
  }, [filters, setSearchParams]);

  async function onCopyList(listId, newName) {
    try {
      await copyList(board._id, listId, newName);
    } catch (error) {
      console.error("List copy failed:", error);
    }
  }

  async function onRemoveList(listId) {}

  async function onUpdateList(list, updates) {
    try {
      const options = { listId: list.id };
      updateBoard(board._id, updates, options);
      showSuccessMsg(`The list ${list.title} updated successfully!`);
    } catch (error) {
      console.error("List update failed:", error);
      showErrorMsg(`Unable to update the list: ${list.title}`);
    }
  }

  async function onAddList(newList) {
    await createList(board._id, newList);

    requestAnimationFrame(() =>
      scrollBoardToEnd({ direction: SCROLL_DIRECTION.HORIZONTAL })
    );
  }

  async function onMoveAllCards(sourceListId, targetListId) {
    try {
      if (targetListId === "new") {
        await moveAllCards(board._id, sourceListId, null, {
          newListName: "New List",
        });
      } else {
        await moveAllCards(board._id, sourceListId, targetListId);
      }
    } catch (error) {
      console.error("Move all cards failed:", error);
    }
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
          {board.lists.map((list, listIndex) => (
            <li key={list.id}>
              <List
                key={list.id}
                list={list}
                boardLabels={board.labels}
                labelsIsOpen={labelsIsOpen}
                setLabelsIsOpen={setLabelsIsOpen}
                onRemoveList={onRemoveList}
                onUpdateList={onUpdateList}
                onCopyList={onCopyList}
                onMoveAllCards={onMoveAllCards}
                isAddingCard={activeAddCardListId === list.id}
                setActiveAddCardListId={setActiveAddCardListId}
                listIndex={listIndex}
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
