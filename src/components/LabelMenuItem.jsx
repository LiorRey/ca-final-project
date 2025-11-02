import Edit from "@mui/icons-material/Edit";

export function LabelMenuItem({ label, isChecked, onToggleLabel, onEdit }) {
  return (
    <div className="label-menu-item">
      <input
        type="checkbox"
        id={`label-${label.id}`}
        checked={isChecked}
        onChange={() => onToggleLabel(label.id)}
        className="label-checkbox"
      />
      <label
        htmlFor={`label-${label.id}`}
        className={`label-color-box label-color-option ${label.color}`}
      >
        {label.title && <span className="label-title">{label.title}</span>}
      </label>
      <button
        className="label-edit-btn"
        aria-label="Edit label"
        onClick={onEdit}
      >
        <Edit />
      </button>
    </div>
  );
}
