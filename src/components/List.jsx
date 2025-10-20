import { useState, useEffect } from "react";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import AddRounded from "@mui/icons-material/AddRounded";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import { Card } from "./Card";

export function List({ list, onRemoveList, onUpdateList }) {
  const [cards, setCards] = useState(list.cards);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setCards(list.cards);
  }, [list.cards]);

  async function onAddCard() {}

  async function onRemoveCard(cardId) {
    await onRemoveList(list.id);
  }

  async function onUpdateCard(card) {
    await onUpdateList(card);
  }

  const handleMoreClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditList = () => {
    // Implement edit list functionality
    handleClose();
  };

  const handleDeleteList = () => {
    // Implement delete list functionality
    onRemoveList(list.id);
    handleClose();
  };

  const handleShowingAddCardActions = () => {
    setIsAddingCard(true);
  };

  const handleHidingAddCardActions = () => {
    setIsAddingCard(false);
  };

  return (
    <section className="list-container">
      <div className="list-header">
        <h2>{list.name}</h2>
        <button className="icon-button" onClick={handleMoreClick}>
          <MoreHoriz />
        </button>
      </div>
      <div className="list-content-container">
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
                type="text"
                placeholder="Enter a title or paste a link"
                className="card-title-input"
                autoFocus
              />
            </Box>
            <div className="card-actions">
              <Button
                className="add-card-contained-button"
                variant="contained"
                size="large"
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
