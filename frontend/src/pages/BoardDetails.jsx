import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LockOutlineRounded from "@mui/icons-material/LockOutlineRounded";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import Sort from "@mui/icons-material/Sort";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { AddList } from "../components/AddList";
import { FilterMenu } from "../components/FilterMenu";
import { Footer } from "../components/Footer";
import { List } from "../components/List";
import { BoardMenu } from "../components/ui/BoardMenu";
import { BackgroundSelector } from "../components/BackgroundSelector";
import { useCardFilters } from "../hooks/useCardFilters";
import { SCROLL_DIRECTION, useScrollTo } from "../hooks/useScrollTo";
import {
  parseFiltersFromSearchParams,
  serializeFiltersToSearchParams,
} from "../services/filter-service";
import { reorderCards, reorderLists } from "../services/dnd-service";
import {
  copyList,
  createList,
  loadBoard,
  loadBoards,
  moveAllCards,
  moveCard,
  moveList,
  updateBoard,
} from "../store/actions/board-actions";

export function BoardDetails() {
  const [activeAddCardListId, setActiveAddCardListId] = useState(null);
  const [mainMenuAnchorEl, setMainMenuAnchorEl] = useState(null);
  const [backgroundSelectorAnchorEl, setBackgroundSelectorAnchorEl] =
    useState(null);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const board = useSelector(state => state.boards.board);
  const boards = useSelector(state => state.boards.boards);
  const [labelsIsOpen, setLabelsIsOpen] = useState(false);
  const boardCanvasRef = useRef(null);
  const scrollBoardToEnd = useScrollTo(boardCanvasRef);
  const { filters, updateFilters } = useCardFilters();
  const [lists, setLists] = useState(board?.lists || []);

  useEffect(() => {
    if (board) {
      setLists(board.lists);
    }
  }, [board]);

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

  async function onAddList(newList) {
    try {
      await createList(board._id, newList);
      requestAnimationFrame(() =>
        scrollBoardToEnd({ direction: SCROLL_DIRECTION.HORIZONTAL })
      );
    } catch (error) {
      console.error("List creation failed:", error);
    }
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

  function handleOpenMainMenu(event) {
    setMainMenuAnchorEl(event.currentTarget);
  }

  function handleCloseMainMenu() {
    setMainMenuAnchorEl(null);
  }

  function handleMenuItemClick(itemId) {
    if (itemId === "background") {
      setBackgroundSelectorAnchorEl(mainMenuAnchorEl);
    }
  }

  function handleCloseBackgroundSelector() {
    setBackgroundSelectorAnchorEl(null);
  }

  async function handleSelectBackground(selectedColor) {
    try {
      await updateBoard(board._id, {
        appearance: { background: selectedColor },
      });
    } catch (error) {
      console.error("Update background failed:", error);
    }
  }

  function handleDragStart() {}

  function handleDragEnd(result) {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      if (type === "LIST") {
        const { newLists, listToMove, before, after } = reorderLists(
          lists,
          source.index,
          destination.index
        );

        setLists(newLists);

        console.log(before, after);

        if (listToMove) {
          moveList(
            board._id,
            source.index,
            destination.index,
            board._id,
            board._id
          );
        }
        return;
      }

      const { newLists, cardToMove } = reorderCards(
        lists,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index,
        draggableId
      );

      setLists(newLists);

      if (cardToMove) {
        const moveData = {
          sourceBoardId: board._id,
          sourceListId: source.droppableId,
          destinationBoardId: board._id,
          destinationListId: destination.droppableId,
          position: destination.index,
        };
        moveCard(moveData, cardToMove);
      }
    } catch (error) {
      console.error("Drag and drop failed:", error);
    }
  }

  if (!board) {
    return <section className="board-container">Loading...</section>;
  }

  function getBackgroundClass(colorName) {
    if (!colorName) return "board-bg-blue";
    return `board-bg-${colorName}`;
  }

  const backgroundClass = getBackgroundClass(board.appearance.background);

  return (
    <section className={`board-container board-bg-base ${backgroundClass}`}>
      <header className={`board-header`}>
        <h2 className="board-title">{board.title}</h2>
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
          <button className="icon-button" onClick={handleOpenMainMenu}>
            <MoreHoriz />
          </button>
        </div>
      </header>
      <div className="board-canvas" ref={boardCanvasRef}>
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Droppable
            droppableId="lists-container"
            direction="horizontal"
            type="LIST"
          >
            {provided => (
              <div
                className="lists-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {lists.map((list, listIndex) => (
                  <List
                    key={list.id}
                    list={list}
                    boardLabels={board.labels}
                    labelsIsOpen={labelsIsOpen}
                    setLabelsIsOpen={setLabelsIsOpen}
                    onCopyList={onCopyList}
                    onMoveAllCards={onMoveAllCards}
                    isAddingCard={activeAddCardListId === list.id}
                    setActiveAddCardListId={setActiveAddCardListId}
                    listIndex={listIndex}
                  />
                ))}
                {provided.placeholder}
                <div>
                  <AddList onAddList={onAddList} />
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <nav className="board-footer">
          <Footer />
        </nav>
      </div>
      <BoardMenu
        anchorEl={mainMenuAnchorEl}
        open={Boolean(mainMenuAnchorEl)}
        onClose={handleCloseMainMenu}
        onItemClick={handleMenuItemClick}
      />
      <BackgroundSelector
        anchorEl={backgroundSelectorAnchorEl}
        open={Boolean(backgroundSelectorAnchorEl)}
        onClose={handleCloseBackgroundSelector}
        currentBackground={board.appearance.background || "blue"}
        onSelectBackground={handleSelectBackground}
      />
    </section>
  );
}
