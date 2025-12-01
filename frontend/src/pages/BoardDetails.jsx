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

  async function onUpdateList(list, updates) {
    try {
      const options = { listId: list.id };
      updateBoard(board._id, updates, options);
    } catch (error) {
      console.error("List update failed:", error);
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
    // Handle menu item clicks here
    console.log(`${itemId} clicked`);
    // Add your custom logic for each menu item
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
      // Check if this is a list drag if not it will default to card drag
      if (type === "LIST") {
        const { newLists, listToMove, before, after } = reorderLists(
          lists,
          source.index,
          destination.index
        );

        setLists(newLists);

        //beforeId afterId
        console.log(before, after);

        if (listToMove) {
          moveList(
            board._id, // sourceBoardId
            source.index, // sourceIndex
            destination.index, // targetIndex
            board._id, // targetBoardId (same board)
            board._id // currentBoardId
          );
        }
        return;
      }

      // Handle card reordering (existing logic)
      const { newLists, cardToMove } = reorderCards(
        lists, // current lists
        source.droppableId, // source list id
        destination.droppableId, // destination list id
        source.index, // source index of the card
        destination.index, // destination index of the card
        draggableId // card id
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

  return (
    <section className="board-container">
      <header className="board-header">
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
                    onUpdateList={onUpdateList}
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
    </section>
  );
}
