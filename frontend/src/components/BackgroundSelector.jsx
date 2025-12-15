import { useSelector } from "react-redux";
import { updateBoard } from "../store/actions/board-actions";
import { BackgroundGrid } from "./ui/BackgroundGrid";
import {
  GRADIENT_BACKGROUNDS,
  IMAGE_BACKGROUNDS,
  SOLID_BACKGROUNDS,
} from "../services/board/board-backgrounds";

export function BackgroundSelector({ currentBackground }) {
  const boardId = useSelector(state => state.boards.board._id);

  async function handleSelectBackground(bg) {
    await updateBoard(boardId, {
      appearance: { background: bg },
    });
  }

  return (
    <div className="background-selector-content">
      <label className="background-selector-label">Gradients</label>
      <BackgroundGrid
        backgrounds={GRADIENT_BACKGROUNDS}
        value={currentBackground}
        onChange={handleSelectBackground}
        size="large"
      />

      <label className="background-selector-label">Colors</label>
      <BackgroundGrid
        backgrounds={SOLID_BACKGROUNDS}
        value={currentBackground}
        onChange={handleSelectBackground}
        size="large"
      />

      <label className="background-selector-label">Images</label>
      <BackgroundGrid
        backgrounds={IMAGE_BACKGROUNDS}
        value={currentBackground}
        onChange={handleSelectBackground}
        size="large"
      />
    </div>
  );
}
