import { useState, useEffect, useRef, useLayoutEffect } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import AddRounded from "@mui/icons-material/AddRounded";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import { Card } from "./Card";
import { boardService } from "../services/board";
import { useScrollToEnd } from "../hooks/useScrollToEnd";

export function List({
  list,
  onRemoveList,
  onUpdateList,
  isAddingCard,
  onSetAddingCard,
}) {
  const [cards, setCards] = useState(list.cards);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const newCardInputRef = useRef(null);
  const [listContentRef, scrollListToEnd] = useScrollToEnd();
  const open = Boolean(anchorEl);

  useEffect(() => {
    setCards(list.cards);
  }, [list.cards]);

  useLayoutEffect(() => {
    scrollListToEnd();
  }, [cards.length, scrollListToEnd]);

  useLayoutEffect(() => {
    if (isAddingCard) {
      newCardInputRef.current?.focus();
    }
  }, [isAddingCard]);

  async function onAddCard() {}

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
          {cards.map(card => (
            <li key={card.id}>
              <Card
                key={card.id}
                card={card}
                onRemoveCard={onRemoveCard}
                onUpdateCard={onUpdateCard}
              />
            </li>
          ))}
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

      {/* Temporary List popover (using MUI Popover) */}
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
    </section>
  );
}
