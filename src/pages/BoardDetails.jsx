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
  updateBoard,
  copyList,
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

  async function onCopyList(listId, newName) {
    try {
      await copyList(board._id, listId, newName);
      showSuccessMsg(`The list copied successfully!`);
    } catch (error) {
      console.error("List copy failed:", error);
      showErrorMsg(`Unable to copy the list: ${listId}`);
    }
  }

  async function onRemoveList(listId) {}

  async function onUpdateList(list, updates) {
    try {
      const options = { listId: list.id };
      updateBoard(board._id, updates, options);
      showSuccessMsg(`The list ${list.name} updated successfully!`);
    } catch (error) {
      console.error("List update failed:", error);
      showErrorMsg(`Unable to update the list: ${list.name}`);
    }
  }

  async function onAddList(newList) {
    const options = { listId: null, cardId: null };
    const updates = { lists: [...board.lists, newList] };
    await updateBoard(board._id, updates, options);

    requestAnimationFrame(() =>
      scrollBoardToEnd({ direction: SCROLL_DIRECTION.HORIZONTAL })
    );
  }

  async function onSaveLabel(labelData) {
    try {
      const existingLabels = board.labels || [];
      const existingLabelIndex = existingLabels.findIndex(
        l => l.id === labelData.id
      );

      let updatedLabels;
      if (existingLabelIndex >= 0) {
        updatedLabels = [...existingLabels];
        updatedLabels[existingLabelIndex] = labelData;
        showSuccessMsg(`Label "${labelData.title}" updated successfully!`);
      } else {
        updatedLabels = [...existingLabels, labelData];
        showSuccessMsg(`Label "${labelData.title}" created successfully!`);
      }

      await updateBoard(board, {
        key: "labels",
        value: updatedLabels,
      });
    } catch (error) {
      console.error("Label save failed:", error);
      showErrorMsg(`Unable to save label: ${labelData.title}`);
    }
  }

  async function onRemoveLabel(labelId) {
    try {
      const existingLabels = board.labels || [];
      const updatedLabels = existingLabels.filter(l => l.id !== labelId);

      await updateBoard(board, {
        key: "labels",
        value: updatedLabels,
      });

      showSuccessMsg("Label removed successfully!");
    } catch (error) {
      console.error("Label removal failed:", error);
      showErrorMsg("Unable to remove label");
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
                onSaveLabel={onSaveLabel}
                onRemoveLabel={onRemoveLabel}
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
