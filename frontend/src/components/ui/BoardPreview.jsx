export function BoardPreview({ boardTitle, boardAppearance, onOpen }) {
  const backgroundClass = boardAppearance
    ? `bg-${boardAppearance.background || "blue"}`
    : "bg-blue";

  return (
    <div
      className={`board-tile board-bg-base ${backgroundClass}`}
      onClick={onOpen}
    >
      <span className="board-preview-title">{boardTitle}</span>
    </div>
  );
}
