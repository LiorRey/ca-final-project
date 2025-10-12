import React from "react";

export default function Card({ card, onRemoveCard, onUpdateCard }) {
  function onRemoveCard() {
    onRemoveCard(card.id);
  }

  function onUpdateCard() {
    onUpdateCard(card);
  }

  return (
    <section className="card-container">
      <h3>{card.title}</h3>
      <p>{card.description}</p>
      <button onClick={onRemoveCard}>Remove</button>
      <button onClick={onUpdateCard}>Update</button>
      <p>
        {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : "N/A"}
      </p>
      <p>
        {card.updatedAt ? new Date(card.updatedAt).toLocaleDateString() : "N/A"}
      </p>
    </section>
  );
}
