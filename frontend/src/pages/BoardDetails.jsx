import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LockOutlineRounded from "@mui/icons-material/LockOutlineRounded";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { AddList } from "../components/AddList";
import { FilterMenu } from "../components/FilterMenu";
import { Footer } from "../components/Footer";
import { List } from "../components/List";
import { BoardMenu } from "../components/ui/BoardMenu";
import { Avatar } from "../components/ui/Avatar";
import { AvatarGroup } from "../components/ui/AvatarGroup";
import { useCardFilters } from "../hooks/useCardFilters";
import { useDragToScroll } from "../hooks/useDragBoard";
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
} from "../store/actions/board-actions";

export function BoardDetails() {
  const [activeAddCardListId, setActiveAddCardListId] = useState(null);
  const [boardMenuAnchorEl, setBoardMenuAnchorEl] = useState(null);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const board = useSelector(state => state.boards.board);
  const boards = useSelector(state => state.boards.boards);
  const [labelsIsOpen, setLabelsIsOpen] = useState(false);
  const boardCanvasRef = useRef(null);
  const scrollBoardToEnd = useScrollTo(boardCanvasRef);
  useDragToScroll(boardCanvasRef, { sensitivity: 1, enabled: !!board }); //drag to scroll the board experimentall
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

  function handleOpenBoardMenu(event) {
    setBoardMenuAnchorEl(event.currentTarget);
  }

  function handleCloseBoardMenu() {
    setBoardMenuAnchorEl(null);
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

        if (listToMove) {
          moveList(listToMove._id, board._id, destination.index);
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

  const backgroundClass = board?.appearance
    ? `bg-${board?.appearance?.background || "blue"}`
    : "bg-blue";

  if (!board) {
    return (
      <section className={`board-container board-bg-base ${backgroundClass}`}>
        Loading...
      </section>
    );
  }

  return (
    <section className={`board-container board-bg-base ${backgroundClass}`}>
      <header className={`board-header`}>
        <h2 className="board-title">{board.title}</h2>
        <div className="board-header-right">
          {board.members && board.members.length > 0 && (
            <AvatarGroup size={32} max={4}>
              {board.members.map(member => (
                <Avatar size={32} key={member._id} user={member} />
              ))}
            </AvatarGroup>
          )}
          <FilterMenu />
          <button className="icon-button">
            <StarBorderRounded />
          </button>
          <button className="icon-button">
            <LockOutlineRounded />
          </button>
          <button className="icon-button" onClick={handleOpenBoardMenu}>
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
                    key={list._id}
                    list={list}
                    boardLabels={board.labels}
                    labelsIsOpen={labelsIsOpen}
                    setLabelsIsOpen={setLabelsIsOpen}
                    onCopyList={onCopyList}
                    onMoveAllCards={onMoveAllCards}
                    isAddingCard={activeAddCardListId === list._id}
                    setActiveAddCardListId={setActiveAddCardListId}
                    listIndex={listIndex}
                  />
                ))}
                {provided.placeholder}
                <div className="add-list">
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
        anchorEl={boardMenuAnchorEl}
        isBoardMenuOpen={Boolean(boardMenuAnchorEl)}
        onCloseBoardMenu={handleCloseBoardMenu}
      />
    </section>
  );
}
