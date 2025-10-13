import { useState, useEffect } from "react";
import Card from "./Card";
import { Ellipsis } from "lucide-react";

export default function List({ list, onRemoveList, onUpdateList }) {
  const [cards, setCards] = useState(list.cards);

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

  return (
    <section className="list-container">
      <div className="list-header">
        <h2>{list.name}</h2>
        <button className="icon-button">
          <Ellipsis />
        </button>
      </div>
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
      <div className="list-footer">
        <button>+ Add Card</button>
      </div>
    </section>
  );
}
