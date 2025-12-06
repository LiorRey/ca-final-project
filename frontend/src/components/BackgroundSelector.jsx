import { useSelector } from "react-redux";
import { updateBoard } from "../store/actions/board-actions";

export function BackgroundSelector({ currentBackground }) {
  const boardId = useSelector(state => state.boards.board._id);

  const bgColors = [
    "blue",
    "orange",
    "green",
    "red",
    "purple",
    "pink",
    "emerald",
    "turquoise",
    "gray",
  ];

  async function handleSelectBackground(selectedColor) {
    await updateBoard(boardId, {
      appearance: { background: selectedColor },
    });
  }

  return (
    <div className="background-selector-content">
      <label className="background-selector-label">Colors</label>

      <div className="background-colors-grid">
        {bgColors.map(bgColor => (
          <button
            key={bgColor}
            className={`background-color-option bg-${bgColor} ${
              currentBackground === bgColor ? "selected" : ""
            }`}
            onClick={() => handleSelectBackground(bgColor)}
            aria-label={`Select ${bgColor} background`}
          >
            {currentBackground === bgColor && (
              <span className="checkmark">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
