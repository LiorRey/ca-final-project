import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard, loadBoard } from "../store/actions/board-actions";
import { Popover } from "./Popover";
import {
  GRADIENT_BACKGROUNDS,
  IMAGE_BACKGROUNDS,
  SOLID_BACKGROUNDS,
} from "../services/board/board-backgrounds";
import { BackgroundGrid } from "./ui/BackgroundGrid";

export function CreateBoardForm({
  anchorEl,
  isCreateFormOpen,
  onCloseCreateForm,
}) {
  const [title, setTitle] = useState("");
  const [background, setBackground] = useState(GRADIENT_BACKGROUNDS[8]);
  const navigate = useNavigate();

  async function onCreateBoard() {
    if (!title.trim()) return;

    const newBoard = await createBoard({
      title,
      lists: [],
      appearance: { background },
    });

    await loadBoard(newBoard._id);
    navigate(`/board/${newBoard._id}`);
    onCloseCreateForm();
  }

  return (
    <Popover
      anchorEl={anchorEl}
      transitionDuration={0}
      isOpen={isCreateFormOpen}
      onClose={onCloseCreateForm}
      title={"Create board"}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      paperProps={{ sx: { mt: 1, pt: 0.7 } }}
      slotProps={{ transition: { onExited: () => onCloseCreateForm() } }}
    >
      <section className="create-board-content">
        <h4 className="section-title">Background</h4>

        <p className="sub-section-title">Gradients</p>
        <BackgroundGrid
          backgrounds={GRADIENT_BACKGROUNDS}
          value={background}
          onChange={setBackground}
          size="small"
        />

        <p className="sub-section-title">Colors</p>
        <BackgroundGrid
          backgrounds={SOLID_BACKGROUNDS}
          value={background}
          onChange={setBackground}
          size="small"
        />

        <p className="sub-section-title">Images</p>
        <BackgroundGrid
          backgrounds={IMAGE_BACKGROUNDS}
          value={background}
          onChange={setBackground}
          size="small"
        />

        <h4 className="section-title">
          Board title <span className="required">*</span>
        </h4>

        <input
          className="board-title-input"
          placeholder="Board title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />

        {!title && <p className="error-text">👋 Board title is required</p>}

        <button
          className="create-board-btn"
          disabled={!title.trim()}
          onClick={onCreateBoard}
        >
          Create
        </button>
      </section>
    </Popover>
  );
}
