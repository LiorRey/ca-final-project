export function CardDetails({ card }) {
  return (
    <section className="card-details">
      <h1>{card.title}</h1>
      <p>{card.description}</p>
    </section>
  );
}
