export default function Card({ card, onRemoveCard, onUpdateCard }) {
  function onRemoveCard() {
    onRemoveCard(card.id);
  }

  function onUpdateCard() {
    onUpdateCard(card);
  }

  return (
    <section className="card-container">
      <div className="card-labels">
        {card.labels.map(label => (
          <div
            key={`${card.id}-${label}`}
            className={`card-label ${label.color}`}
          >
            {label.name}
          </div>
        ))}
      </div>
      <h3 className="card-title">{card.title}</h3>
      <div className="card-footer">
        <p>{card.description}</p>
      </div>
    </section>
  );
}
