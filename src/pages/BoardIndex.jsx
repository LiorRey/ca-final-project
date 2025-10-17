import { BoardDetails } from "./BoardDetails";

import { carService } from "../services/car/car-service-local";

export function BoardIndex() {
  const boardObject = carService.getBoardObject();
  return (
    <section className="board-index">
      <BoardDetails board={boardObject} />
    </section>
  );
}
