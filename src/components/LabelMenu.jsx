import { Box } from "@mui/material";
import { LabelMenuItem } from "./LabelMenuItem";

export function LabelMenu({ boardLabels }) {
  return (
    <section className="label-menu card-content">
      <h3>Labels</h3>
      <ul className="labels-list">
        {boardLabels.map(label => (
          <li key={label.id}>
            <LabelMenuItem key={label.id} label={label} />
          </li>
        ))}
      </ul>
    </section>
  );
}
