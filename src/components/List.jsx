import { useState, useEffect } from "react";
import { Card } from "./Card";
import { MoreHoriz } from "@mui/icons-material";
import { AddRounded } from "@mui/icons-material";
import { Popover, MenuItem, MenuList } from "@mui/material";

export function List({ list, onRemoveList, onUpdateList }) {
  const [cards, setCards] = useState(list.cards);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setCards(list.cards);
  }, [list.cards]);

  async function onAddCard() {}

  async function onRemoveCard(cardId) {
    await onRemoveList(list.id);
  }

  async function onUpdateCard(card) {
    setCards(prev => [...prev, card]);
    await onUpdateList({ ...list, cards });
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
        <button className="add-card-button">
          <AddRounded /> Add Card
        </button>
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
