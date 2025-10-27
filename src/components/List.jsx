import { useEffect, useRef, useState } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import AddRounded from "@mui/icons-material/AddRounded";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Card } from "./Card";
import { CardModal } from "./CardModal";
import { ListActionsMenu } from "./ListActionsMenu";
import { SquareIconButton } from "./ui/buttons/SquareIconButton";
import { boardService } from "../services/board";
import { SCROLL_DIRECTION, useScrollTo } from "../hooks/useScrollTo";

export function List({
  list,
  boardLabels,
  labelsIsOpen,
  setLabelsIsOpen,
  onRemoveList,
  onUpdateList,
  isAddingCard,
  setActiveAddCardListId,
}) {
  const [cards, setCards] = useState(list.cards);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const listContentRef = useRef(null);
  const scrollListToEnd = useScrollTo(listContentRef);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setCards(list.cards);
  }, [list.cards]);

  async function onRemoveCard(cardId) {
    await onRemoveList(list.id);
  }

  async function onUpdateCard(card) {
    setCards(prev => [...prev, card]);
    const options = { key: "cards", value: cards };
    await onUpdateList(list, options);
  }

  function handleMoreClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleEditList() {
    handleClose();
  }

  function handleDeleteList() {
    onRemoveList(list.id);
    handleClose();
  }

  function handleShowAddCard() {
    setNewCardTitle("");
    setActiveAddCardListId(list.id);
    requestAnimationFrame(() =>
      scrollListToEnd({ direction: SCROLL_DIRECTION.VERTICAL })
    );
  }

  function handleHideAddCard() {
    setNewCardTitle("");
    setActiveAddCardListId(null);
  }

  function handleAddCard() {
    if (!newCardTitle) {
      handleHideAddCard();
      return;
    }

    const newCard = {
      ...boardService.getEmptyCard(),
      title: newCardTitle,
      createdAt: Date.now(),
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);

    const options = { key: "cards", value: updatedCards };
    onUpdateList(list, options);

    setNewCardTitle("");
    requestAnimationFrame(() =>
      scrollListToEnd({ direction: SCROLL_DIRECTION.VERTICAL })
    );
  }

  function handleOpenModal(card) {
    setSelectedCard(card);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setSelectedCard(null);
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
        <h2>{list.name}</h2>
        <SquareIconButton
          icon={<MoreHoriz />}
          onClick={handleMoreClick}
          selected={open}
        />
      </div>
      <div className="list-content-container" ref={listContentRef}>
        <ul className="cards-list">
          {cards.map(card => {
            const cardLabels =
              boardLabels && card.labels && card.labels.length > 0
                ? card.labels
                    .map(labelId => boardLabels.find(l => l.id === labelId))
                    .filter(Boolean)
                : [];
            return (
              <li key={card.id}>
                <Card
                  card={card}
                  labels={cardLabels}
                  onClickCard={card => handleOpenModal(card)}
                  onRemoveCard={onRemoveCard}
                  onUpdateCard={onUpdateCard}
                  labelsIsOpen={labelsIsOpen}
                  setLabelsIsOpen={setLabelsIsOpen}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="list-footer">
        {!isAddingCard ? (
          <button className="add-card-card-button" onClick={handleShowAddCard}>
            <AddRounded /> Add a card
          </button>
        ) : (
          <section className="add-card-container">
            <div className="card-content">
              <input
                type="text"
                className="card-title-input"
                value={newCardTitle}
                onChange={e => setNewCardTitle(e.target.value)}
                placeholder="Enter a title or paste a link"
                autoFocus
              />
            </div>
            <div className="add-card-buttons-container">
              <Button
                className="add-card-contained-button"
                variant="contained"
                size="large"
                onClick={handleAddCard}
                onMouseDown={e => e.preventDefault()}
              >
                Add card
              </Button>
              <button className="icon-button" onClick={handleHideAddCard}>
                ✕
              </button>
            </div>
          </section>
        )}
      </div>

      <ListActionsMenu
        anchorEl={anchorEl}
        isOpen={open}
        onClose={handleClose}
        onEditList={handleEditList}
        onDeleteList={handleDeleteList}
      />

      {/* Card Modal will be moved out of here */}
      <CardModal
        listTitle={list.name}
        cardLabels={getCardLabels(selectedCard)}
        card={selectedCard}
        onClose={handleCloseModal}
        isOpen={openModal}
      />
    </section>
  );
}
