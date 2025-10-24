import { useEffect, useRef, useState } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import AddRounded from "@mui/icons-material/AddRounded";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Card } from "./Card";
import { CardModal } from "./CardModal";
import { boardService } from "../services/board";
import { useScrollToEnd } from "../hooks/useScrollToEnd";
import { useEffectUpdate } from "../hooks/useEffectUpdate";

export function List({
  list,
  boardLabels,
  onRemoveList,
  onUpdateList,
  isAddingCard,
  onSetAddingCard,
}) {
  const [cards, setCards] = useState(list.cards);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const newCardInputRef = useRef(null);
  const [listContentRef, scrollListToEnd] = useScrollToEnd();
  const open = Boolean(anchorEl);

  useEffect(() => {
    setCards(list.cards);
  }, [list.cards]);

  useEffect(() => {
    if (isAddingCard) {
      newCardInputRef.current?.focus();
    }
  }, [isAddingCard]);

  useEffectUpdate(() => {
    scrollListToEnd();
  }, [cards.length, scrollListToEnd]);

  async function onRemoveCard(cardId) {
    await onRemoveList(list.id);
  }

  async function onUpdateCard(card) {
    setCards(prev => [...prev, card]);
    const options = { key: "cards", value: cards };
    await onUpdateList(list, options);
  }

  const handleMoreClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditList = () => {
    handleClose();
  };

  const handleDeleteList = () => {
    onRemoveList(list.id);
    handleClose();
  };

  const handleShowingAddCardActions = () => {
    setNewCardTitle("");
    onSetAddingCard(list.id);
  };

  const handleHidingAddCardActions = () => {
    setNewCardTitle("");
    onSetAddingCard(null);
  };

  const handleAddCard = () => {
    if (!newCardTitle) {
      handleHidingAddCardActions();
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
    newCardInputRef.current?.focus();
  };

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
        <button className="icon-button" onClick={handleMoreClick}>
          <MoreHoriz />
        </button>
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
                  key={card.id}
                  card={card}
                  labels={cardLabels}
                  onClickCard={card => handleOpenModal(card)}
                  onRemoveCard={onRemoveCard}
                  onUpdateCard={onUpdateCard}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="list-footer">
        {!isAddingCard ? (
          <button
            className="add-card-card-button"
            onClick={handleShowingAddCardActions}
          >
            <AddRounded /> Add a card
          </button>
        ) : (
          <section className="add-card-actions-container">
            <Box
              className={`${open ? "floating-card-content" : "card-content"}`}
              sx={open ? { zIndex: theme => theme.zIndex.modal + 1 } : {}}
            >
              <input
                ref={newCardInputRef}
                type="text"
                className="card-title-input"
                value={newCardTitle}
                onChange={e => setNewCardTitle(e.target.value)}
                placeholder="Enter a title or paste a link"
              />
            </Box>
            <div className="card-actions">
              <Button
                className="add-card-contained-button"
                variant="contained"
                size="large"
                onClick={handleAddCard}
              >
                Add card
              </Button>
              <button
                className="icon-button"
                onClick={handleHidingAddCardActions}
              >
                ✕
              </button>
            </div>
          </section>
        )}
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "black",
              color: "white",
              boxShadow: "none",
              borderRadius: "5px",
              border: "1px solid white",
            },
          },
        }}
      >
        <MenuList>
          <MenuItem onClick={handleEditList}>Edit List</MenuItem>
          <MenuItem onClick={handleDeleteList}>Delete List</MenuItem>
        </MenuList>
      </Popover>

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
