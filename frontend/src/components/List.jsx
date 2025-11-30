import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddRounded from "@mui/icons-material/AddRounded";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import { Card } from "./Card";
import { ListActionsMenu } from "./ListActionsMenu";
import { SquareIconButton } from "./ui/buttons/SquareIconButton";
import { SCROLL_DIRECTION, useScrollTo } from "../hooks/useScrollTo";
import { setActiveListIndex } from "../store/actions/ui-actions";
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
  const navigate = useNavigate();
  const location = useLocation();
  const listContentRef = useRef(null);
  const scrollListToEdge = useScrollTo(listContentRef);
  const open = Boolean(anchorEl);

  function handleOpenModal(card) {
    navigate(`${list.id}/${card.id}`, {
      state: { backgroundLocation: location },
    });
  }

  function handleMoreClick(event) {
    setAnchorEl(event.currentTarget);
    setActiveListIndex(listIndex);
    handleHideAddCardForm();
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleEditList() {
    handleClose();
  }

  function handleShowAddCardForm(scrollToBottom = true) {
    setActiveAddCardListId(list.id);
    setAddCardToEnd(scrollToBottom);

    requestAnimationFrame(() =>
      scrollListToEdge({
        direction: SCROLL_DIRECTION.VERTICAL,
        scrollToBottom,
      })
    );
  }

  function handleHideAddCardForm() {
    setActiveAddCardListId(null);
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
    return card && card.labels && boardLabels && card.labels.length > 0
      ? card.labels
          .map(labelId => boardLabels.find(l => l.id === labelId))
          .filter(Boolean)
      : [];
  }

  return (
    <section className="list-container">
      <div className="list-header">
        <h2>{list.title}</h2>
        <SquareIconButton
          icon={<MoreHoriz />}
          onClick={handleMoreClick}
          selected={open}
        />
      </div>
      <div className="list-add-card-header">
        {isAddingCard && !addCardToEnd && (
          <AddCardForm
            listId={list.id}
            addCardToEnd={addCardToEnd}
            onCardAdded={scrollToAddedCard}
            onHideAddCardForm={handleHideAddCardForm}
          />
        )}
      </div>
      <div className="list-content-container" ref={listContentRef}>
        <ul className="cards-list">
          {list.cards.map(card => {
            return (
              <li key={card.id}>
                <Card
                  card={card}
                  listId={list.id}
                  labels={getCardLabels(card)}
                  onClickCard={card => handleOpenModal(card)}
                  labelsIsOpen={labelsIsOpen}
                  setLabelsIsOpen={setLabelsIsOpen}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="list-footer">
        {isAddingCard && addCardToEnd ? (
          <AddCardForm
            listId={list.id}
            addCardToEnd={addCardToEnd}
            onCardAdded={scrollToAddedCard}
            onHideAddCardForm={handleHideAddCardForm}
          />
        ) : (
          <button
            className="add-card-card-button"
            onClick={handleShowAddCardForm}
          >
            <AddRounded /> Add a card
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
  );
}
