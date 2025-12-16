import { useState } from "react";
import { PopoverMenu } from "./ui/PopoverMenu";
import "../assets/styles/components/AttachmentMenu.css";
import { upsertCardCover } from "../store/actions/board-actions";
import { COVER_COLORS } from "../services/board/board-backgrounds";

export function AttachmentMenu({
  card,
  anchorEl,
  isAttachFileMenuOpen,
  onCloseAttachFileMenu,
}) {
  const [textOverlay, setTextOverlay] = useState(card.cover?.textOverlay);
  const [selectedColor, setSelectedColor] = useState(
    COVER_COLORS.find(color => color.value === card.cover?.color) || null
  );

  function handleCloseMenu() {
    onCloseAttachFileMenu();
  }

  function handleTextOverlay(overlay) {
    setTextOverlay(overlay);
    upsertCardCover(card._id, {
      color: selectedColor?.value,
      textOverlay: overlay,
    });
  }

  function handleColorSelect(color) {
    setSelectedColor(color);
    upsertCardCover(card._id, { color: color.value });
  }

  function handleRemoveCover() {
    setTextOverlay(false);
    setSelectedColor(null);
    upsertCardCover(card._id, { color: null, textOverlay: false });
  }

  return (
    <PopoverMenu
      anchorEl={anchorEl}
      isOpen={isAttachFileMenuOpen}
      onClose={handleCloseMenu}
      title="Cover"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      paperProps={{ sx: { mt: 1 } }}
      sx={{
        zIndex: theme => theme.zIndex.modal + 1,
      }}
    >
      <div className="attachment-menu-content">
        {selectedColor && (
          <div className="cover-section">
            <label className="cover-section-label">Style</label>
            <div className="cover-size-options">
              <button
                type="button"
                role="radio"
                aria-checked={textOverlay === false}
                aria-label="Title under cover"
                className={`cover-size-preview ${
                  textOverlay === false ? "selected" : ""
                }`}
                style={{ backgroundColor: selectedColor?.value }}
                onClick={() => handleTextOverlay(false)}
              >
                <CoverPreviewSkeleton className="cover-preview-container" />
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={textOverlay === true}
                aria-label="Title on cover"
                className={`cover-size-preview ${
                  textOverlay === true ? "selected" : ""
                }`}
                style={{ backgroundColor: selectedColor?.value }}
                onClick={() => handleTextOverlay(true)}
              >
                <CoverPreviewSkeleton className="cover-preview-container-transparent" />
              </button>
            </div>
          </div>
        )}

        {(selectedColor || card.cover?.color) && (
          <button className="remove-cover-button" onClick={handleRemoveCover}>
            Remove cover
          </button>
        )}

        <div className="cover-section">
          <label className="cover-section-label">Colors</label>
          <div className="cover-colors-grid">
            {COVER_COLORS.map(color => (
              <button
                key={color.name}
                className={`cover-color-swatch ${
                  selectedColor === color.name ? "selected" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorSelect(color)}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      </div>
    </PopoverMenu>
  );
}

function CoverPreviewSkeleton({ className }) {
  return (
    <div className={className}>
      <div className="cover-preview-image"></div>
      <div className="cover-preview-spacer"></div>
      <div className="cover-preview-lines">
        <div className="cover-preview-line"></div>
        <div className="cover-preview-line"></div>
        <div className="cover-preview-line"></div>
      </div>
    </div>
  );
}
