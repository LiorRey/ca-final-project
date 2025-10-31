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
  const [draggedListId, setDraggedListId] = useState(null);
  const [displayedLists, setDisplayedLists] = useState([]);
  const isUpdatingRef = useRef(false);
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

  useEffect(() => {
    if (board && board.lists && !draggedListId && !isUpdatingRef.current) {
      setDisplayedLists(board.lists);
    }
  }, [board, draggedListId]);

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

  async function onUpdateList(list, { cardId = null, key, value }) {
    try {
      const options = { listId: list.id, cardId, key, value };
      updateBoard(board._id, options);
      showSuccessMsg(`The list ${list.name} updated successfully!`);
    } catch (error) {
      console.error("List update failed:", error);
      showErrorMsg(`Unable to update the list: ${list.name}`);
    }
  }

  async function onAddList(newList) {
    await updateBoard(board._id, {
      key: "lists",
      value: [...board.lists, newList],
    });

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

  function handleDragStart(e, listId) {
    setDraggedListId(listId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  function handleDragOver(e, targetListId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (!draggedListId || draggedListId === targetListId) return;

    const draggedIndex = displayedLists.findIndex(l => l.id === draggedListId);
    const targetIndex = displayedLists.findIndex(l => l.id === targetListId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLists = [...displayedLists];
    const [draggedList] = newLists.splice(draggedIndex, 1);
    newLists.splice(targetIndex, 0, draggedList);

    setDisplayedLists(newLists);
  }

  function handleDragEnd() {
    setDraggedListId(null);

    if (board && board.lists && !isUpdatingRef.current) {
      setDisplayedLists(board.lists);
    }
  }

  async function handleDrop(e, targetListId) {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedListId) {
      return;
    }

    const originalOrder = board.lists.map(l => l.id);
    const currentOrder = displayedLists.map(l => l.id);
    const orderChanged =
      JSON.stringify(originalOrder) !== JSON.stringify(currentOrder);

    setDraggedListId(null);

    if (!orderChanged) {
      return;
    }

    const finalLists = [...displayedLists];

    isUpdatingRef.current = true;

    try {
      await updateBoard(board._id, {
        key: "lists",
        value: finalLists,
      });
      showSuccessMsg("List reordered successfully!");
    } catch (error) {
      console.error("List reorder failed:", error);
      showErrorMsg("Unable to reorder lists");

      if (board && board.lists) {
        setDisplayedLists(board.lists);
      }
    } finally {
      isUpdatingRef.current = false;
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
          {displayedLists.map(list => (
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
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                isDragging={draggedListId === list.id}
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
