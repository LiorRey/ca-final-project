import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import AddRounded from "@mui/icons-material/AddRounded";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { TextField } from "@mui/material";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "./Card";
import { ListActionsMenu } from "./ListActionsMenu";
import { SCROLL_DIRECTION, useScrollTo } from "../hooks/useScrollTo";
import { setActiveListIndex } from "../store/actions/ui-actions";
import { updateList } from "../store/actions/board-actions";
import { AddCardForm } from "./AddCardForm";

export function List({
  list,
  boardLabels,
  labelsIsOpen,
  setLabelsIsOpen,
  onCopyList,
  isAddingCard,
  setActiveAddCardListId,
  listIndex,
  onMoveAllCards,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addCardToEnd, setAddCardToEnd] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const navigate = useNavigate();
  const location = useLocation();
  const listContentRef = useRef(null);
  const titleInputRef = useRef(null);
  const scrollListToEdge = useScrollTo(listContentRef);
  const open = Boolean(anchorEl);

  function handleOpenModal(card) {
    navigate(`${list._id}/${card._id}`, {
      state: { backgroundLocation: location },
    });
  }

  function handleMoreClick(event) {
    setAnchorEl(event.currentTarget);
    setActiveListIndex(listIndex);
    setActiveAddCardListId(null);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleEditList() {
    handleClose();
  }

  function handleShowAddCardForm(scrollToBottom = true) {
    setActiveAddCardListId(list._id);
    setAddCardToEnd(scrollToBottom);

    requestAnimationFrame(() =>
      scrollListToEdge({
        direction: SCROLL_DIRECTION.VERTICAL,
        scrollToBottom,
      })
    );
  }

  function scrollToAddedCard() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() =>
        scrollListToEdge({
          direction: SCROLL_DIRECTION.VERTICAL,
          scrollToBottom: addCardToEnd,
        })
      );
    });
  }

  function getCardLabels(card) {
    return card && card.labelIds && boardLabels && card.labelIds.length > 0
      ? card.labelIds
          .map(labelId => boardLabels.find(l => l._id === labelId))
          .filter(Boolean)
      : [];
  }

  async function handleSaveTitle() {
    setIsEditingTitle(false);
    if (listTitle.trim() && listTitle !== list.title) {
      try {
        await updateList(list._id, { title: listTitle });
      } catch (error) {
        console.error("Error updating list title:", error);
        setListTitle(list.title);
      }
    } else {
      setListTitle(list.title);
    }
  }

  return (
    <Draggable draggableId={list._id} index={listIndex} type="LIST">
      {(provided, snapshot) => (
        <section
          className={`list-container ${
            snapshot.isDragging ? "list-dragging" : ""
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="list-header" {...provided.dragHandleProps}>
            {isEditingTitle ? (
              <TextField
                inputRef={titleInputRef}
                value={listTitle}
                size="small"
                variant="outlined"
                onChange={e => setListTitle(e.target.value)}
                onBlur={handleSaveTitle}
                autoFocus
                className="list-title-input"
              />
            ) : (
              <h2
                onClick={() => {
                  setIsEditingTitle(true);
                  setListTitle(list.title);
                }}
                className="list-title"
                style={{ cursor: "pointer" }}
              >
                {list.title}
              </h2>
            )}

            <IconButton aria-label="List options" onClick={handleMoreClick}>
              <MoreHoriz />
            </IconButton>
          </div>
          {isAddingCard && !addCardToEnd && (
            <div className="list-add-card-header">
              <AddCardForm
                listId={list._id}
                addCardToEnd={addCardToEnd}
                onCardAdded={scrollToAddedCard}
                onHideAddCardForm={() => setActiveAddCardListId(null)}
              />
            </div>
          )}

          <Droppable droppableId={list._id}>
            {(provided, snapshot) => {
              return (
                <div
                  className="cards-droppable-wrapper"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div
                    className={`cards-list ${
                      snapshot.isDraggingOver ? "drag-over" : ""
                    }`}
                    ref={listContentRef}
                  >
                    {list.cards.map((card, index) => (
                      <Card
                        key={card._id}
                        card={card}
                        listId={list._id}
                        index={index}
                        labels={getCardLabels(card)}
                        onClickCard={card => handleOpenModal(card)}
                        labelsIsOpen={labelsIsOpen}
                        setLabelsIsOpen={setLabelsIsOpen}
                      />
                    ))}
                    <div
                      className={`placeholder ${
                        snapshot.isDraggingOver
                          ? "placeholder--visible"
                          : "placeholder--hidden"
                      }`}
                    >
                      {provided.placeholder}
                    </div>
                  </div>
                </div>
              );
            }}
          </Droppable>

          <div className="list-footer">
            {isAddingCard && addCardToEnd ? (
              <AddCardForm
                listId={list._id}
                addCardToEnd={addCardToEnd}
                onCardAdded={scrollToAddedCard}
                onHideAddCardForm={() => setActiveAddCardListId(null)}
              />
            ) : (
              <button
                className="add-card-card-button"
                onClick={handleShowAddCardForm}
              >
                <AddRounded />
                Add a card
              </button>
            )}
          </div>

          <ListActionsMenu
            list={list}
            anchorEl={anchorEl}
            isOpen={open}
            onClose={handleClose}
            onEditList={handleEditList}
            onAddCardAtTop={() => handleShowAddCardForm(false)}
            onCopyList={onCopyList}
            onMoveAllCards={onMoveAllCards}
          />
        </section>
      )}
    </Draggable>
  );
}
