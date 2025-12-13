export function BoardPreview({ boardTitle, boardAppearance, onOpen }) {
  const backgroundClass = boardAppearance
    ? `bg-${boardAppearance.background || "blue"}`
    : "bg-blue";

  return (
    <div
      className={`board-tile board-bg-base ${backgroundClass}`}
      onClick={onOpen}
    >
      <div className="board-preview-footer">
        <span className="board-preview-title">{boardTitle}</span>
      </div>
    </div>
  );
}
