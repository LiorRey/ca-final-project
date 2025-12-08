import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <section className="home">
      <h1>Home sweet Home</h1>
      <h2>
        <Link to="/board">Go to Boards</Link>
      </h2>
    </section>
  );
}
