import { Popover } from "./Popover";
import { LabelMenuItem } from "./LabelMenuItem";

export function LabelMenu({
  boardLabels,
  anchorEl,
  isLabelMenuOpen,
  onCloseLabelMenu,
}) {
  return (
    <Popover
      className="label-menu-popover"
      anchorEl={anchorEl}
      open={isLabelMenuOpen}
      onClose={onCloseLabelMenu}
      title="Labels"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
    >
      <div className="label-menu-content">
        <input
          type="text"
          className="label-search"
          placeholder="Search labels..."
          autoFocus
        />

        <h3>Labels</h3>

        <ul className="labels-list">
          {boardLabels.map(label => (
            <li key={label.id}>
              <LabelMenuItem label={label} />
            </li>
          ))}
        </ul>

        <button className="create-label-btn">Create a new label</button>
      </div>
    </Popover>
  );
}
