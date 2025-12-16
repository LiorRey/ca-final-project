export function BackgroundGrid({
  backgrounds,
  value,
  onChange,
  size = "large",
}) {
  return (
    <div className={`background-grid ${size}`}>
      {backgrounds.map(bg => (
        <button
          key={bg}
          type="button"
          className={`bg-tile bg-${bg} ${value === bg ? "selected" : ""}`}
          onClick={() => onChange(bg)}
          aria-label={`Select ${bg} background`}
        >
          {value === bg && <span className="checkmark">✓</span>}
        </button>
      ))}
    </div>
  );
}
